import { ConfirmDialogService } from './../services/confirm-dialog.service';
import { AppStateService } from './../services/state.service';
import { ResponsiveService } from './../services/responsive.service';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LinksComponent } from '../links/links.component';
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { LinkComponent } from '../link/link.component';
import { Router, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { LinkBlock } from '../shared/models/basics.model';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormStateService } from '../services/form-state.service';
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
  private formStateService = inject(FormStateService);
  private confirmDialogService = inject(ConfirmDialogService);
  private cdRef = inject(ChangeDetectorRef);

  selectedSection = 'links';
  isMaxWidth700$ = this.responsiveService.isCustomMax700;
  isMaxWidth900$ = this.responsiveService.isCustomMax900;

  links$ = this.appStateService.links$.pipe(map((links) => links.slice(0, 5)));
  profile$ = this.appStateService.profile$;

  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.data.subscribe((data) => {
        if (data['backendData']) {
          const { links, profile } = data['backendData'];
          this.appStateService.saveLinks(links);
          this.appStateService.saveProfile(profile);
          this.appStateService.updateProfile(profile);
          this.cdRef.detectChanges();
        }
      })
    );

    this.subscriptions.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.selectedSection = params['selectedSection'];
        if (
          this.selectedSection !== 'links' &&
          this.selectedSection !== 'profile-details'
        ) {
          this.redirectToDefaultSection();
        }
      })
    );
  }

  private redirectToDefaultSection() {
    const userId = this.activatedRoute.snapshot.params['id'];
    this.router.navigate(['/link-sharing-dashboard', userId], {
      queryParams: { selectedSection: 'links' },
    });
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
    const userId = this.activatedRoute.snapshot.params['id'];
    if (this.formStateService.formChanged()) {
      this.subscriptions.add(
        this.confirmDialogService.openConfirmDialog().subscribe((status) => {
          if (status === 'discard') {
            switch (this.selectedSection) {
              case 'links':
                this.appStateService.synchronizeLinksToInitial();
                break;
              default:
                this.appStateService.synchronizeProfileToInitial();
            }
            this.formStateService.setFormChanged(false);
            this.router.navigate(['/preview', userId]);
          }
        })
      );
    } else {
      this.router.navigate(['/preview', userId]);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  toggleSelection(section: 'profile' | 'links'): void {
    if (this.formStateService.formChanged()) {
      this.subscriptions.add(
        this.confirmDialogService.openConfirmDialog().subscribe((status) => {
          if (status === 'discard') {
            switch (section) {
              case 'links':
                this.appStateService.synchronizeProfileToInitial();
                break;
              default:
                this.appStateService.synchronizeLinksToInitial();
            }
            this.moveToSection(section);
          }
        })
      );
    } else {
      this.moveToSection(section);
    }
  }

  moveToSection(section: 'profile' | 'links') {
    const userId = this.activatedRoute.snapshot.params['id'];
    this.formStateService.setFormChanged(false);
    if (section === 'links') {
      this.router.navigate(['link-sharing-dashboard', userId], {
        queryParams: { selectedSection: 'links' },
      });
    } else if (section === 'profile') {
      this.router.navigate(['link-sharing-dashboard', userId], {
        queryParams: { selectedSection: 'profile-details' },
      });
    }
  }
}
