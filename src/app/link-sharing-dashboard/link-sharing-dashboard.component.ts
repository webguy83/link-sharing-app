import { AppStateService } from './../services/state.service';
import { ResponsiveService } from './../services/responsive.service';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LinksComponent } from '../links/links.component';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { LinkComponent } from '../link/link.component';
import {
  Router,
  RouterOutlet,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { LinkBlock } from '../shared/models/basics.model';
import { AvatarComponent } from '../avatar/avatar.component';
@Component({
  selector: 'app-link-sharing-dashboard',
  standalone: true,
  imports: [
    SharedModule,
    LinksComponent,
    ProfileDetailsComponent,
    LinkComponent,
    RouterOutlet,
    AvatarComponent,
  ],
  templateUrl: './link-sharing-dashboard.component.html',
  styleUrls: ['./link-sharing-dashboard.component.scss'],
})
export class LinkSharingDashboardComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  private responsiveService = inject(ResponsiveService);
  private appStateService = inject(AppStateService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  selectedSection = 'links';
  isMaxWidth700$ = this.responsiveService.isCustomMax700;
  isMaxWidth900$ = this.responsiveService.isCustomMax900;
  links$ = this.appStateService.links$.pipe(map((links) => links.slice(0, 5)));
  profile$ = this.appStateService.profile$;

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      const resolvedData = data['profileAndLinks']; // 'profileAndLinks' should match the key used in your route configuration

      if (resolvedData) {
        // Update the AppStateService with the fetched data
        this.appStateService.saveProfile(resolvedData.userProfile);
        this.appStateService.saveLinks(resolvedData.userLinks);
      }
    });

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

  getTruncatedName(name: string, maxLength: number): string {
    return name.length > maxLength
      ? `${name.substring(0, maxLength)}...`
      : name;
  }

  trackByFn(index: number, link: LinkBlock) {
    return `${link.platform}-${link.profileUrl}-${link.bgColour}-${link.iconFileName}-${index}`;
  }

  goToPreview() {
    this.router.navigate(['/preview', 'fucker']);
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
