import { UnsavedChangesComponent } from './../shared/models/unsaved-changes.interface';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements UnsavedChangesComponent {
  profileDetailsForm: FormGroup;
  isMaxWidth600$ = this.responsiveService.isCustomMax600;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  getErrorId = getErrorId;
  constructor(
    private fb: FormBuilder,
    private responsiveService: ResponsiveService
  ) {
    this.profileDetailsForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  discardChanges(): void {}
  hasUnsavedChanges(): boolean {
    return false;
  }

  showError() {
    return '';
  }

  onSubmit() {}
}
