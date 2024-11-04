import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchValidator(options: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Return null if no value is entered
    }
    return options.includes(control.value) ? null : { match: true };
  };
}
