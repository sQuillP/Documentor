import { AbstractControl, ValidationErrors } from "@angular/forms";

export function forbiddenCharacterValidator(control:AbstractControl):ValidationErrors|null{
    const invalidInput = /[^a-zA-Z _0-9]/gi.test(control.value);
    return invalidInput ? {forbiddenCharacter: {value: control.value}}:null;
  }