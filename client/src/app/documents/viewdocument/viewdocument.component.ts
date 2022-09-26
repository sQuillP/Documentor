import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { BehaviorSubject, fromEvent, map, mergeMap, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';
import {EditMembersComponent} from '../edit-members/edit-members.component'
import { DeletePopupComponent } from '../delete-popup/delete-popup.component';
import { RenamePopupComponent } from '../rename-popup/rename-popup.component';
import { FormControl } from '@angular/forms';
import { Socket } from 'ngx-socket-io';
/* QUILL TO PDF!!! DO NOT FORGET!!! */

@Component({
  selector: 'app-viewdocument',
  templateUrl: './viewdocument.component.html',
  styleUrls: ['./viewdocument.component.css']
})
export class ViewdocumentComponent implements OnInit, AfterViewInit {

  @ViewChild("editor",{static:true}) editor:ElementRef;
  quillEditor:any;

  currentDocument:any = null;
  form:FormControl;
  myPermission:any = null;
  keyPressed:boolean = false;
  private readonly SNACKBAR_DURATION:number = 5000;
  loadedDocumentData$ = new BehaviorSubject<any>(null);
  readonly$ = new BehaviorSubject<boolean>(true);
  listener:()=>void;
  constructor(
    private documentService:DocumentService,
    private route:ActivatedRoute,
    private snackbar:MatSnackBar,
    private router:Router,
    private auth:AuthService,
    private dialog:MatDialog,
    private socket:Socket,
    private renderer:Renderer2
    ) {
      this.receiveLiveDocumentChanges();
    }

  ngOnInit(): void {
    this.route.params.pipe(
      mergeMap((params:any)=> this.documentService.getDocumentById(params.documentId,null)),
    )
    .subscribe({
      next:(document:any) => {
        document.content = JSON.parse(document.content); //jsonify data before anything else
        this.currentDocument = document;

        for(let permission of document.permissions){
          if(permission.user === this.auth.userId$.getValue())
            this.myPermission = permission;
        }

        this.loadedDocumentData$.next(document.content);
        if(!this.myPermission || this.myPermission.access !== 'readonly')
          this.readonly$.next(false);

      },
      error: (error)=> {
        this.snackbar.open("Something went wrong with opening document","OK");
        this.router.navigate(["documents"])
      }
    })
  }


  ngAfterViewInit(): void {
      this.listener = this.renderer.listen(this.editor.nativeElement,'click',(keypress)=> {
        this.keyPressed = true;
      })
  }


  onSaveDocument():void{
    this.documentService.saveDocument(this.currentDocument._id,{
      content: JSON.stringify(this.currentDocument.content),
    })
    .subscribe({
      next:(data)=> {
        console.log(data);
        this.snackbar.open("Document Saved successfully","OK",{
          duration: this.SNACKBAR_DURATION
        });
      },
      error: (error)=> {
        console.log(error);
        this.snackbar.open("Document save unsuccessful","OK",{
          duration: this.SNACKBAR_DURATION
        });
      }
    });
  }


  onEditTitle():void{
    const dialogRef = this.dialog.open(RenamePopupComponent,{
      data:{
        documentName: this.currentDocument.title
      }
    });
    dialogRef.afterClosed().pipe(
      mergeMap(data => {
        if(data)
           return this.documentService.saveDocument(this.currentDocument._id,{title: data})
        return of(null);
      }),
    ).subscribe({
      next:(document:any)=> {
        if(!document) return;
        this.currentDocument = document;
        this.snackbar.open(`Document successfully renamed`,"OK",{duration:this.SNACKBAR_DURATION});
      },
      error:(error)=>{
        console.log(error);
        this.snackbar.open(`Unable to successfully rename document`,"OK",{duration:this.SNACKBAR_DURATION});
      }
    })
  }


  handleChange(event:any):void{
    if(!event.content || !this.keyPressed) return;
    console.log(event);
    this.currentDocument.content = event.content;
    this.socket.emit('modify-document',this.currentDocument._id,JSON.stringify(event.content.ops));
    this.keyPressed = false;
  }


  receiveLiveDocumentChanges():void{
    this.socket.on('add-document-changes',(documentChanges)=> {
      documentChanges = JSON.parse(documentChanges);
      console.log(documentChanges);
      console.log(this.editor);
      // this.quillEditor.setContents(documentChanges);
      this.currentDocument.content = {ops:documentChanges};
    });
  }



  /* Load text editor with contents to be created */
  onCreate(editor:any){
    this.quillEditor = editor;
    this.loadedDocumentData$.subscribe(delta => {
      if(!delta) return;
      editor.setContents(delta);
      
    });
  }


  onDeleteDocument():void{
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data:{
        title: this.currentDocument.title
      }
    });
    dialogRef.afterClosed().pipe(
      mergeMap((closed:boolean)=>closed?this.documentService.deleteDocument(this.currentDocument._id):of(false))
    )
    .subscribe({
      next:(success:boolean)=> {
        this.snackbar.open(`Document ${this.currentDocument.title} has been successfully removed`,'OK',{duration:this.SNACKBAR_DURATION});
        this.router.navigate(['documents']);
      },
      error: (error)=> {
        console.log(error);
        this.snackbar.open(`Unable to delete "${this.currentDocument.title}".`,"OK",{duration:this.SNACKBAR_DURATION});
      }
    })
  }


  onEditTeam():void{
    const dialogRef = this.dialog.open(EditMembersComponent,{
      data:{
        document: this.currentDocument
      }
    });
    dialogRef.afterClosed().pipe(
      mergeMap((data:any)=> !data ? of(null) : this.documentService.saveDocument(this.currentDocument._id,data))
    )
    .subscribe({
      next: (document:any)=>{
        if(!document)return;
        this.currentDocument = document;
        console.log(this.currentDocument)
        this.snackbar.open("Document Successfully Updated","OK",{duration: this.SNACKBAR_DURATION});
      },
      error: (error:any)=> {
        console.log(error);
        this.snackbar.open("Unable to successfully save changes to document","OK",{duration:this.SNACKBAR_DURATION});
      }
    })
  }



  /* Return true if user has access to resource/permission */
  permitAccess(permissionInput:string):boolean{
    if(this.auth.userId$.getValue() === this.currentDocument.author || permissionInput === "readonly")
      return true;
    switch(permissionInput){
      case "modify":
        return this.myPermission.access === "modify" || this.myPermission.access === "admin";
      case "admin":
        return this.myPermission.access ==="admin";
    }
    return false;
  }
}