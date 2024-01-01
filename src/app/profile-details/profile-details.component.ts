import { UnsavedChangesComponent } from './../shared/models/unsaved-changes.interface';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
})
export class ProfileDetailsComponent implements UnsavedChangesComponent {
  hasUnsavedChanges(): boolean {
    return false;
  }
}
