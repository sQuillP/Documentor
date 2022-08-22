import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  documentName:string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher{
  isErrorState(control: AbstractControl<any, any>, form: FormGroupDirective | NgForm): boolean {
    return control.touched && !control.value;
  }
  
}


@Component({
  selector: 'app-rename-popup',
  templateUrl: './rename-popup.component.html',
  styleUrls: ['./rename-popup.component.css']
})
export class RenamePopupComponent implements OnInit {

  docNameFormControl:FormControl;
  matcher:MyErrorStateMatcher;
  constructor(
    public dialogRef:MatDialogRef<RenamePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { 

    this.docNameFormControl = new FormControl("",[Validators.required]);
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit(): void {
  }

  onDismiss():void{
    this.dialogRef.close();
  }

}
