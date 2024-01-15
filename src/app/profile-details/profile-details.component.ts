import { AppStateService } from './../services/state.service';
import { UnsavedChangesComponent } from './../shared/models/unsaved-changes.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { ImageUploadComponent } from '../image-upload/image-upload.component';
import { Profile } from '../shared/models/basics.model';
import { ProfileDetailsService } from './profile-details.service';

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
export class ProfileDetailsComponent
  implements UnsavedChangesComponent, OnInit, OnDestroy
{
  profileDetailsForm: FormGroup;
  formSubmitted = false;
  hasFormChanged = false;
  initialDataLoaded = false;
  isMaxWidth600$ = this.responsiveService.isCustomMax600;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  getErrorId = getErrorId;
  alphaOnly = this.profileDetailsService.alphaOnly;
  initialProfilePicture: File | null = null;

  private subscriptions = new Subscription();
  constructor(
    private fb: FormBuilder,
    private responsiveService: ResponsiveService,
    private appStateService: AppStateService,
    private profileDetailsService: ProfileDetailsService
  ) {
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
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  discardChanges(): void {
    this.appStateService.synchronizeProfileToInitial();
  }

  hasUnsavedChanges(): boolean {
    return this.hasFormChanged;
  }

  subscribeToFormChanges() {
    this.subscriptions.add(
      this.profileDetailsForm.valueChanges.subscribe((profile: Profile) => {
        if (this.profileDetailsForm.dirty) {
          this.hasFormChanged = true;
          this.appStateService.updateProfile(profile);
        }
      })
    );
  }

  populateInitialFormData(): void {
    this.subscriptions.add(
      this.appStateService.initialProfile$.subscribe((profile) => {
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
    if (this.profileDetailsForm.valid) {
      const profileData = this.profileDetailsForm.value as Profile;
      console.log(profileData);
      this.appStateService.saveProfile(profileData);
      this.formSubmitted = false;
      this.hasFormChanged = false;
    }
  }
}
