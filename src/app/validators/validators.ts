import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  // Cast the abstract control to FormGroup
  const formGroup = control as FormGroup;
  const password = formGroup.get('createPassword')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  // Check if both fields have values and if they match
  if (password && confirmPassword && password !== confirmPassword) {
    return { passwordMismatch: true };
  }
  return null;
}
