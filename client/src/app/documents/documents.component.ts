import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    private dialog:MatDialog,
    private documentService:DocumentService
  ) {}

  ngOnInit(): void {
    this.onFetchDocuments();
  }

  onCloseOverlay(event:boolean):void{
    console.log(event)
    this.showOverlay = !event;
  }

  onOpenEditDialog():void{
    const dialogRef = this.dialog.open(RenamePopupComponent, {
      data: {
        documentName: this.documentName
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.documentName = result;
    })
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

}
