import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { getErrorId } from '../shared/constants/error-id';

@Component({
  selector: 'app-signin-form',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './signin-form.component.html',
  styleUrl: './signin-form.component.scss',
})
export class SigninFormComponent {
  signInForm: FormGroup;
  formSubmitted = false;
  isLoggingIn = false;
  getErrorId = getErrorId;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  showEmailError() {
    const control = this.signInForm.get('email');
    if (control && this.formSubmitted) {
      if (control.hasError('required')) {
        return "Can't be empty";
      } else if (control.hasError('email')) {
        return 'Must be a valid email';
      }
    }
    return '';
  }

  showPasswordError() {
    const control = this.signInForm.get('password');
    if (control && this.formSubmitted) {
      if (control.hasError('required')) {
        return "Can't be empty";
      } else if (control.hasError('minlength')) {
        return 'Please check again';
      }
    }
    return '';
  }

  onSubmit(signInForm: FormGroup) {
    this.formSubmitted = true;

    if (signInForm.valid) {
      const email = signInForm.value.email;
      const password = signInForm.value.password;
      this.isLoggingIn = true;

      this.authService.signIn(email, password).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['dark-gray-snackbar'],
          });
          this.router.navigate(['/link-sharing-dashboard']);
        },
        error: () => {
          this.isLoggingIn = false; // Re-enable the button
          this.snackBar.open('Login attempt failed!', 'Close', {
            duration: 3000,
            panelClass: ['dark-gray-snackbar'],
          });
        },
      });
    } else {
      // Handle the invalid form case, e.g., show validation messages
      this.isLoggingIn = false;
    }
  }
}
