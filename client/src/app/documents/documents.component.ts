import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DocumentService } from '../services/document.service';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { RenamePopupComponent } from './rename-popup/rename-popup.component';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {

  showOverlay:boolean = false;
  documentName:string = "";
  removeDocId:string = "";
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
        documentName: this.documentName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.documentName = result;
      console.log(document)
      this.documentService.saveDocument({title:result, _id:document._id})
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

  onOpenDeleteDialog():void{
    const dialogRef = this.dialog.open(DeletePopupComponent);

    dialogRef.afterClosed().subscribe((removeDocument:any) => {
        if(!removeDocument) return;
      // Logic for removing a document from the db.
        // this.documentService.deleteDocument()
    });
  }

  onViewDocument(documentId:string):void{
    this.router.navigate(["documents",documentId]);
  }

}
