import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-link-sharing-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './link-sharing-dashboard.component.html',
  styleUrl: './link-sharing-dashboard.component.scss',
})
export class LinkSharingDashboardComponent {
  isProfileSelected = false;
  toggleSelection(isProfile: boolean = true) {
    if (isProfile) {
      this.isProfileSelected = true;
    } else {
      this.isProfileSelected = false;
    }
  }
}
