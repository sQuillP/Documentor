import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyErrorStateMatcher } from 'src/app/util/errorStateMatcher';

export interface DialogData {
  documentName:string;
}



@Component({
  selector: 'app-rename-popup',
  templateUrl: './rename-popup.component.html',
  styleUrls: ['./rename-popup.component.css']
})
export class RenamePopupComponent {

  docNameFormControl:FormControl;
  matcher:MyErrorStateMatcher;

  constructor(
    public dialogRef:MatDialogRef<RenamePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 
    this.docNameFormControl = new FormControl(data.documentName,
      [Validators.required, Validators.maxLength(20)]
    );
    this.matcher = new MyErrorStateMatcher();
  }


  onDismiss():void{
    this.dialogRef.close(); 
  }

}
