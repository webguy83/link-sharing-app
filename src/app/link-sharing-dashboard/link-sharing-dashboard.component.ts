import { Subscription } from 'rxjs';
import { ResponsiveService } from './../services/responsive.service';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-link-sharing-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './link-sharing-dashboard.component.html',
  styleUrls: ['./link-sharing-dashboard.component.scss'],
})
export class LinkSharingDashboardComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  constructor(
    private responsiveService: ResponsiveService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}
  ngOnInit(): void {
    const mobileSubscription = this.responsiveService.isCustomMax700.subscribe(
      (isMobile) => {
        const dashboardContainer = this.el.nativeElement.querySelector(
          '.dashboard-container'
        );
        if (dashboardContainer) {
          if (isMobile) {
            this.renderer.addClass(dashboardContainer, 'mobile');
          } else {
            this.renderer.removeClass(dashboardContainer, 'mobile');
          }
        }
      }
    );

    this.subscription.add(mobileSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  isProfileSelected = false;
  isLinksSelected = true;

  toggleSelection(button: 'profile' | 'links') {
    if (button === 'profile') {
      this.isProfileSelected = true;
      this.isLinksSelected = false;
    } else {
      this.isProfileSelected = false;
      this.isLinksSelected = true;
    }
  }
}
