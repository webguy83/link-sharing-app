import { ResponsiveService } from './../services/responsive.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LinksComponent } from '../links/links.component';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { AppStateService } from '../services/state.service';
import { LinkComponent } from '../link/link.component';
import {
  Router,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-link-sharing-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    LinksComponent,
    ProfileDetailsComponent,
    LinkComponent,
    RouterOutlet,
  ],
  templateUrl: './link-sharing-dashboard.component.html',
  styleUrls: ['./link-sharing-dashboard.component.scss'],
})
export class LinkSharingDashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  [x: string]: any;
  selectedSection = 'links';
  isMaxWidth700$ = this.responsiveService.isCustomMax700;
  isMaxWidth900$ = this.responsiveService.isCustomMax900;
  links$ = this.appStateService.links$.pipe(
    map((links) => links.slice(0, 5)) // Take only the first five links for the phone image
  );

  constructor(
    private responsiveService: ResponsiveService,
    private appStateService: AppStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check the initial route
    const currentRoute =
      this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    if (currentRoute === 'links') {
      this.selectedSection = 'links';
    } else if (currentRoute === 'profile-details') {
      this.selectedSection = 'profile';
    }

    // Subscribe to router events for subsequent navigation
    this.subscriptions.add(
      this.router.events
        .pipe(
          filter(
            (event): event is NavigationEnd => event instanceof NavigationEnd
          )
        )
        .subscribe((event: NavigationEnd) => {
          if (
            event.urlAfterRedirects.includes('/link-sharing-dashboard/links')
          ) {
            this.selectedSection = 'links';
          } else if (
            event.urlAfterRedirects.includes(
              '/link-sharing-dashboard/profile-details'
            )
          ) {
            this.selectedSection = 'profile';
          }
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleSelection(section: 'profile' | 'links'): void {
    if (section === 'links') {
      this.router.navigate(['/', 'link-sharing-dashboard', 'links']);
    } else if (section === 'profile') {
      this.router.navigate(['/', 'link-sharing-dashboard', 'profile-details']);
    }
  }
}
