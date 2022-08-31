import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  sharedDocuments$:Observable<any>;
  SNACKBAR_DURATION:number = 5000;

  constructor(
    private dialog:MatDialog,
    private documentService:DocumentService,
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
    this.myDocuments$ = this.documentService.getMyDocuments();
    this.sharedDocuments$ = this.documentService.getSharedDocuments();
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

  onViewDocument(documentId:string):void{
    this.router.navigate(["documents",documentId]);
  }

}
