import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DocumentService } from 'src/app/services/document.service';


/* QUILL TO PDF!!! DO NOT FORGET!!! */

@Component({
  selector: 'app-viewdocument',
  templateUrl: './viewdocument.component.html',
  styleUrls: ['./viewdocument.component.css']
})
export class ViewdocumentComponent implements OnInit {

  @ViewChild("editor",{static:true}) editor:QuillEditorComponent;


  currentDocument:any = null;
  myPermission:any = null;
  SNACKBAR_DURATION:number = 5000;
  loadedDocument$:BehaviorSubject<any>;

  constructor(
    private documentService:DocumentService,
    private route:ActivatedRoute,
    private snackbar:MatSnackBar,
    private router:Router,
    private auth:AuthService,
    ) {
      this.loadedDocument$ = new BehaviorSubject<any>(null);
    }

  ngOnInit(): void {
    this.route.params.subscribe((params:any)=> {
      this.documentService.getDocumentById(params.documentId)
      .subscribe({
        next:(document:any) => {
          document.content = JSON.parse(document.content); //jsonify data before anything else
          this.currentDocument = document;
          for(let permission of document.permissions){
            if(permission.user === this.auth.userId$.getValue())
              this.myPermission = permission;
          }
          if(this.myPermission && this.myPermission.access === 'readonly')
            this.editor.readOnly = true;
          this.loadedDocument$.next(document.content)
          console.log('loaded document',this.currentDocument);
        },
        error: (error)=> {
          console.log('Unable to fetch document');
          this.snackbar.open("Something went wrong with opening document","OK");
          this.router.navigate(["documents"])
        }
      })
    });
  }


  onSaveDocument():void{

    /**
     *  this.documentService.saveDocument({
      content: JSON.stringify(this.currentDocument.content),
      _id: this.currentDocument._id
    })
     * 
     */
    
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

  handleChange(event:any){
    if(!event.content) return;
    this.currentDocument.content = event.content;
  }


  /* Load text editor with contents to be created */
  onCreate(editor){
    this.loadedDocument$.subscribe(delta => {
      if(!delta) return;
      editor.setContents(delta);
    });
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