import { FormStateService } from './../services/form-state.service';
import { AppStateService } from './../services/state.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import { getErrorId } from '../shared/constants/error-id';
import { Subscription, finalize, forkJoin } from 'rxjs';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Profile } from '../shared/models/basics.model';
import { ProfileDetailsService } from './profile-details.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ImageUploadComponent,
  ],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
  providers: [ProfileDetailsService],
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  responsiveService = inject(ResponsiveService);
  appStateService = inject(AppStateService);
  profileDetailsService = inject(ProfileDetailsService);
  notificationService = inject(NotificationService);
  userService = inject(UserService);
  authService = inject(AuthService);
  formStateService = inject(FormStateService);
  profileDetailsForm: FormGroup;
  formSubmitted = false;
  hasFormChanged = this.formStateService.formChanged;
  initialDataLoaded = false;
  isMaxWidth600$ = this.responsiveService.isCustomMax600;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  getErrorId = getErrorId;
  alphaOnly = this.profileDetailsService.alphaOnly;
  initialProfilePicture: File | null = null;
  userId: string | null = null;
  formSaving = false;

  private subscriptions = new Subscription();
  constructor() {
    this.profileDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      picture: [null],
    });
  }

  ngOnInit(): void {
    this.subscribeToFormChanges();
    this.populateInitialFormData();
    this.subscriptions.add(
      this.authService.user$.subscribe((user) => {
        this.userId = user ? user.uid : null;
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  subscribeToFormChanges() {
    this.subscriptions.add(
      this.profileDetailsForm.valueChanges.subscribe((profile: Profile) => {
        if (this.profileDetailsForm.dirty) {
          this.formStateService.setFormChanged(true);
          this.appStateService.updateProfile(profile);
        }
      })
    );
  }

  populateInitialFormData(): void {
    this.subscriptions.add(
      this.appStateService.profile$.subscribe((profile) => {
        if (profile && !this.initialDataLoaded) {
          this.profileDetailsForm.patchValue({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            picture: profile.picture,
          });
          if (profile.picture) {
            this.initialProfilePicture = profile.picture;
          }
          this.initialDataLoaded = true; // Set the flag to true after loading initial data
        }
      })
    );
  }

  showRequiredError(formLabel: string) {
    const control = this.profileDetailsForm.get(formLabel);
    if (control && this.formSubmitted) {
      if (control.hasError('required')) {
        return "Can't be empty";
      }
    }
    return '';
  }

  showEmailError() {
    const control = this.profileDetailsForm.get('email');
    if (control && this.formSubmitted) {
      if (control.hasError('email')) {
        return 'Must be a valid email';
      }
    }
    return '';
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.profileDetailsForm.valid && this.userId) {
      this.formSaving = true;
      const profileData = this.profileDetailsForm.value as Profile;

      // Observable for uploading profile picture
      const uploadProfilePicture$ = this.userService.uploadProfilePicture(
        this.userId,
        profileData.picture
      );

      // Observable for updating user profile
      const updateUserProfile$ = this.userService.createUserProfile(
        this.userId,
        profileData
      );

      // Use forkJoin to wait for both observables to complete
      forkJoin([uploadProfilePicture$, updateUserProfile$])
        .pipe(
          finalize(() => {
            this.formSaving = false;
          })
        )
        .subscribe({
          next: () => {
            this.notificationService.showNotification(
              'Your changes have been successfully saved!'
            );
            this.appStateService.saveProfile(profileData);
            this.formSubmitted = false;
            this.formStateService.setFormChanged(false);
          },
          error: () => {
            this.notificationService.showNotification(
              'Error saving changes! Please try again later.',
              '../../assets/images/icon-changes-saved.svg'
            );
          },
        });
    }
  }
}
