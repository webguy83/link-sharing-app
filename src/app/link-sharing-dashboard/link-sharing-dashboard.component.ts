import { ResponsiveService } from './../services/responsive.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LinksComponent } from '../links/links.component';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
@Component({
  selector: 'app-link-sharing-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    LinksComponent,
    ProfileDetailsComponent,
  ],
  templateUrl: './link-sharing-dashboard.component.html',
  styleUrls: ['./link-sharing-dashboard.component.scss'],
})
export class LinkSharingDashboardComponent {
  selectedSection = 'links';
  isMaxWidth700$ = this.responsiveService.isCustomMax700;
  isMaxWidth900$ = this.responsiveService.isCustomMax900;

  constructor(private responsiveService: ResponsiveService) {}

  toggleSelection(section: 'profile' | 'links'): void {
    this.selectedSection = section;
  }
}
