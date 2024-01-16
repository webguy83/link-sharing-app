import { ResponsiveService } from './../services/responsive.service';
import { AvatarComponent } from './../avatar/avatar.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AppStateService } from '../services/state.service';
import { Subscription, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
  profile$ = this.appStateService.profile$;
  links$ = this.appStateService.links$;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  isMaxWidth350$ = this.responsiveService.isCustomMax350;

  private subscriptions: Subscription = new Subscription();

  @ViewChild('userCard') userCard!: ElementRef<HTMLDivElement>;
  @ViewChild('bgPanel') bgPanel!: ElementRef<HTMLDivElement>;
  @ViewChild('nameTextElm') nameTextElm!: ElementRef<HTMLParagraphElement>;
  isAuthenticated: boolean = false;

  constructor(
    private appStateService: AppStateService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private location: Location,
    public authService: AuthService
  ) {
    this.subscriptions.add(
      this.authService.isAuthenticated().subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
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

  ngOnInit() {}

  backToEditor() {
    const state = this.location.getState() as any;

    if (state && state.navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/link-sharing-dashboard']);
    }
  }

  shareLink() {
    // Logic to share the link
  }
}
