import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeletePopupComponent>
  ) {}


  onDismiss():void{
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
