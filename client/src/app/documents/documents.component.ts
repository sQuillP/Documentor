import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { DocumentService } from '../services/document.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { EditMembersComponent } from './edit-members/edit-members.component';
import { RenamePopupComponent } from './rename-popup/rename-popup.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  showOverlay:boolean = false;
  documentName:string = "";
  myDocuments$:Observable<any>;
  myDocuments:any;
  sharedDocuments$:Observable<any>;
  sharedDocuments:any;
  SNACKBAR_DURATION:number = 5000;
 

  disableRename:boolean = true;
  disableEditMembers:boolean = true;
  disableDelete:boolean = true;

  constructor(
    private dialog:MatDialog,
    private documentService:DocumentService,
    private auth:AuthService,
    private router:Router,
    private snackbar:MatSnackBar
  ) {}

  ngOnInit(): void {
    this.onFetchDocuments();
  }

  onCloseOverlay(event:boolean):void{
    this.showOverlay = !event;
  }

  onOpenEditDialog(document:any):void{
    const dialogRef = this.dialog.open(RenamePopupComponent, {
      data: {
        documentName: document.title
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.documentName = result;
      console.log(result)
      this.documentService.saveDocument(document._id, {title: result})
      .subscribe({
        next: (success)=> {
          this.snackbar.open("Document save successful","OK",{
            duration: this.SNACKBAR_DURATION
          });
          document.title = result;
        },
        error: (error) =>{
          console.log(error);
        }
      });
      
    });
  }

  onFetchDocuments():void{
    this.myDocuments$ = this.documentService.getMyDocuments()
    .pipe(tap(data=>this.myDocuments = data));
    this.sharedDocuments$ = this.documentService.getSharedDocuments()
    .pipe(map((data:any) => !data.length?null:data));
  }


  onDisableBtn(document:any):boolean{
    if(!this.myDocuments) return false;
    console.log(this.myDocuments)
  }
  

  onOpenDeleteDialog(document:any):void{
    const dialogRef = this.dialog.open(DeletePopupComponent,{
      data: {
        title: document.title
      }
    });

    dialogRef.afterClosed().subscribe((removeDocument:boolean) => {
        if(!removeDocument) return;
        this.documentService.deleteDocument(document._id)
        .subscribe({
          next: (result)=>{
            this.onFetchDocuments();
            this.snackbar.open(`Document: "${document.title}" Has Been Removed`, "OK",{duration:this.SNACKBAR_DURATION});
          },
          error: (error)=> {
            this.snackbar.open(`Unable to remove ${document.title}`,"OK",{duration:this.SNACKBAR_DURATION});
          }
        })
    });
  }

  onOpenEditMemberDialog(document:any):void {
    const dialogref = this.dialog.open(EditMembersComponent, {
      data: {
        document
      }
    });

    dialogref.afterClosed().subscribe((data:any) => {
      if(!data) return;
      let msg = "";

      this.documentService.saveDocument(document._id, data).subscribe({
        next:(success:boolean)=> {
          console.log(success);
          if(!success) return;
          this.onFetchDocuments();
          this.snackbar.open("Permissions Successfully Updated","OK",{duration: this.SNACKBAR_DURATION});
        },
        error: (error)=> {
          this.snackbar.open("Unable to Save Permissions","OK",{duration: this.SNACKBAR_DURATION});
        }
      });

      console.log(!!data);
    })

  }

  /* */
  onSelectDocumentOptions(document:any):void{
    let currentAccess = '';
    for(const permission of document.permissions)
      if(permission.user === this.auth.authToken$.getValue())
        currentAccess = permission.access;
    if(document.author === this.auth.userId$.getValue() || currentAccess === 'admin')
      this.setDisabledProperties(false, false, false);
    else if(currentAccess === 'modify')
      this.setDisabledProperties(false,true,true);
    else
      this.setDisabledProperties(true,true,true);
    
  }

  private setDisabledProperties(disableRename:boolean, disableEditMembers:boolean, disableDeleteMembers:boolean):void{
    this.disableRename = disableRename;
    this.disableEditMembers = disableEditMembers;
    this.disableDelete = disableDeleteMembers;
  }

  onViewDocument(documentId:string):void{
    this.router.navigate(["documents",documentId]);
  }

}
