import { ResponsiveService } from './../services/responsive.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LinksComponent } from '../links/links.component';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { PhoneSvgStateService } from '../services/phone-svg-state.service';
import { LinkComponent } from '../link/link.component';
@Component({
  selector: 'app-link-sharing-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    LinksComponent,
    ProfileDetailsComponent,
    LinkComponent,
  ],
  templateUrl: './link-sharing-dashboard.component.html',
  styleUrls: ['./link-sharing-dashboard.component.scss'],
})
export class LinkSharingDashboardComponent {
  selectedSection = 'links';
  isMaxWidth700$ = this.responsiveService.isCustomMax700;
  isMaxWidth900$ = this.responsiveService.isCustomMax900;
  svgState$ = this.phoneSvgStateService.state$;

  constructor(
    private responsiveService: ResponsiveService,
    private phoneSvgStateService: PhoneSvgStateService
  ) {}

  toggleSelection(section: 'profile' | 'links'): void {
    this.selectedSection = section;
  }
}
