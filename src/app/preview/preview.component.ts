import { NotificationService } from './../services/notification.service';
import { ResponsiveService } from './../services/responsive.service';
import { AvatarComponent } from './../avatar/avatar.component';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { AppStateService } from '../services/state.service';
import { Subscription, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LinkComponent } from '../link/link.component';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [CommonModule, AvatarComponent, SharedModule, LinkComponent],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.scss',
})
export class PreviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private appStateService = inject(AppStateService);
  private responsiveService = inject(ResponsiveService);
  private router = inject(Router);
  private location = inject(Location);
  private notificationService = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);
  private cdRef = inject(ChangeDetectorRef);
  authService = inject(AuthService);
  profile$ = this.appStateService.profile$;
  links$ = this.appStateService.links$;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  isMaxWidth350$ = this.responsiveService.isCustomMax350;

  private subscriptions: Subscription = new Subscription();

  @ViewChild('userCard') userCard!: ElementRef<HTMLDivElement>;
  @ViewChild('bgPanel') bgPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('nameTextElm') nameTextElm!: ElementRef<HTMLParagraphElement>;
  isAuthenticated = false;

  constructor() {}
  ngOnInit(): void {
    this.subscriptions.add(
      this.activatedRoute.paramMap
        .pipe(
          switchMap((params) => {
            const urlUserId = params.get('id');
            // Return an observable combining both the URL ID and the authenticated user's ID
            return this.authService.user$.pipe(
              map((user) => ({ urlUserId, authUserId: user?.uid }))
            );
          })
        )
        .subscribe({
          next: ({ urlUserId, authUserId }) => {
            if (urlUserId === authUserId) {
              this.isAuthenticated = true;
            }
          },
          error: (err) => console.error(err),
        })
    );

    this.subscriptions.add(
      this.activatedRoute.data.subscribe((data) => {
        if (data['backendData']) {
          const { links, profile } = data['backendData'];
          this.appStateService.updateLinks(links);
          this.appStateService.updateProfile(profile);
          this.cdRef.detectChanges();
        }
      })
    );

    this.subscriptions.add(
      this.profile$.subscribe((profile) => {
        if (!profile.firstName.length && !profile.lastName.length) {
          this.router.navigate(['']);
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.adjustBackgroundPanelHeight();
  }

  @HostListener('window:resize')
  onResize() {
    this.adjustBackgroundPanelHeight();
  }

  private adjustBackgroundPanelHeight(): void {
    const nameTextElmOffset = this.nameTextElm.nativeElement.offsetTop;
    const userCardElmOffset = this.userCard.nativeElement.offsetTop;
    this.bgPanel.nativeElement.style.height = `${
      userCardElmOffset + (nameTextElmOffset - userCardElmOffset)
    }px`;
  }

  backToEditor() {
    const state = this.location.getState() as any;

    if (state && state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/link-sharing-dashboard']);
    }
  }

  shareLink() {
    this.notificationService.showNotification(
      'The link has been copied to your clipboard!',
      '../../assets/images/icon-link.svg'
    );
  }
}
