import {AbstractControl, ValidationErrors} from "@angular/forms";

export function passwordMatch(control: AbstractControl<string | null>): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  const error = { passwordMatch: { mismatch: true }};
  if (password?.value === confirmPassword?.value) {
    return null;
  }
  confirmPassword?.setErrors(error);
  return error;
}
