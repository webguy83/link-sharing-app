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
  profilePictureUrl: string | null = null;
  firstName = '';
  lastName = '';
  email = '';
  selectedSection = 'links';
  isMaxWidth700$ = this.responsiveService.isCustomMax700;
  isMaxWidth900$ = this.responsiveService.isCustomMax900;
  links$ = this.appStateService.links$.pipe(map((links) => links.slice(0, 5)));

  constructor(
    private responsiveService: ResponsiveService,
    private appStateService: AppStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const currentRoute =
      this.activatedRoute.snapshot.firstChild?.routeConfig?.path;
    if (currentRoute === 'links') {
      this.selectedSection = 'links';
    } else if (currentRoute === 'profile-details') {
      this.selectedSection = 'profile';
    }

    this.subscriptions.add(
      this.appStateService.profile$.subscribe((profile) => {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
        this.email = profile.email;

        if (profile && profile.picture) {
          this.profilePictureUrl = URL.createObjectURL(profile.picture);
        } else {
          this.profilePictureUrl = null;
        }
      })
    );

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

  get firstNameInitial(): string {
    return this.firstName.charAt(0).toUpperCase();
  }

  get lastNameInitial(): string {
    return this.lastName.charAt(0).toUpperCase();
  }

  getTruncatedName(name: string, maxLength: number): string {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  }

  get truncatedFirstName(): string {
    return this.getTruncatedName(this.firstName, 25);
  }

  get truncatedLastName(): string {
    return this.getTruncatedName(this.lastName, 25);
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
