import { AbstractControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class MyErrorStateMatcher implements ErrorStateMatcher{
    isErrorState(control: AbstractControl<any, any>, form: FormGroupDirective | NgForm): boolean {
      return !!(control && control.invalid && (control.dirty || control.touched ));
    }
}