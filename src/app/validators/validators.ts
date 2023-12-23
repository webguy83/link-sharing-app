import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-options';

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

export const linkPlatformValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!(control instanceof FormGroup)) {
    return null;
  }

  const platformControl = control.get('platform');
  const linkControl = control.get('link');

  if (!platformControl || !linkControl) {
    return null;
  }

  const platform = platformControl.value;
  const link = linkControl.value;
  const platformOption = platformOptions.find(
    (option) => option.value === platform
  );

  if (platformOption && platformOption.urlPattern) {
    const regex = new RegExp(platformOption.urlPattern);
    if (!regex.test(link)) {
      return { invalidLinkPlatform: true };
    }
  }

  return null;
};
