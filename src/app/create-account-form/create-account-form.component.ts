import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../services/auth.service';
import { passwordMatchValidator } from '../validators/validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { PrimaryBtnDirective } from '../shared/directives/primary-btn.directive';
import { getErrorId } from '../shared/constants/error-id';

@Component({
  selector: 'app-create-account-form',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './create-account-form.component.html',
  styleUrl: './create-account-form.component.scss',
})
export class CreateAccountFormComponent {
  createAccountForm: FormGroup;
  formSubmitted = false;
  isLoggingIn = false;
  getErrorId = getErrorId;

  @ViewChild(PrimaryBtnDirective) primaryButtonDirective!: PrimaryBtnDirective;

  private updateButtonState() {
    if (this.primaryButtonDirective) {
      this.primaryButtonDirective.resetButtonStyles();
    }
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.createAccountForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        createPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  showEmailError() {
    const control = this.createAccountForm.get('email');
    if (control && this.formSubmitted) {
      if (control.hasError('required')) {
        return "Can't be empty";
      } else if (control.hasError('email')) {
        return 'Must be a valid email';
      }
    }
    return '';
  }

  getPasswordError(): string {
    const passwordControl = this.createAccountForm.get('createPassword');
    const confirmPasswordControl =
      this.createAccountForm.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      if (!passwordControl.value && this.formSubmitted) {
        return "Can't be empty";
      }
      if (!confirmPasswordControl.value && this.formSubmitted) {
        return "Can't be empty";
      }
      if (
        this.createAccountForm.errors?.['passwordMismatch'] &&
        this.formSubmitted
      ) {
        return "Passwords don't match";
      }
      if (passwordControl.hasError('minlength') && this.formSubmitted) {
        return 'Password must be at least 8 characters';
      }
    }

    return '';
  }

  onSubmit(createAccountForm: FormGroup) {
    this.formSubmitted = true;

    if (createAccountForm.valid) {
      this.isLoggingIn = true;
      const email = createAccountForm.value.email;
      const password = createAccountForm.value.createPassword;

      this.authService
        .signUp(email, password)
        .pipe(
          finalize(() => {
            this.isLoggingIn = false;
            this.updateButtonState();
          })
        )
        .subscribe({
          next: () => {
            this.snackBar.open('Account created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['dark-gray-snackbar'],
            });
            this.router.navigate(['/link-sharing-dashboard']);
          },
          error: (error) => {
            let errorMessage = 'Failed to create an account!';

            // Check if the user exists
            if (error.code === 'auth/email-already-in-use') {
              errorMessage = 'Email already in use!';
            }

            this.snackBar.open(errorMessage, 'Close', {
              duration: 3000,
              panelClass: ['dark-gray-snackbar'],
            });
          },
        });
    } else {
      this.isLoggingIn = false;
      this.updateButtonState();
    }
  }
}
