import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';

@Directive({
  selector: '[appOutlineBtn]',
})
export class OutlineBtnDirective implements OnInit, OnDestroy {
  private isMax700 = false;
  private subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.applyDefaultStyles();
    this.setupResponsiveStyles();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private applyDefaultStyles(): void {
    const styles: { [key: string]: string } = {
      borderColor: 'var(--primary)',
      color: 'var(--primary)',
      fontWeight: '600',
      fontSize: '1.6rem',
      // Default padding, will be overridden by responsive styles if needed
      padding: '1.1rem 2.7rem',
      borderRadius: '0.8rem',
      borderStyle: 'solid',
      borderWidth: '1px',
      backgroundColor: 'transparent',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
    this.setStyles(styles);
  }

  private applyHoverStyles(): void {
    const hoverStyles: { [key: string]: string } = {
      backgroundColor: '#EFEBFF',
      // Responsive padding
      padding: this.isMax700 ? '1.1rem 1.6rem' : '1.1rem 2.7rem',
    };
    this.setStyles(hoverStyles);
  }

  private setStyles(styles: { [key: string]: string }): void {
    Object.keys(styles).forEach((property) => {
      this.renderer.setStyle(this.el.nativeElement, property, styles[property]);
    });
  }

  private setupResponsiveStyles(): void {
    const responsiveSubscription =
      this.responsiveService.isCustomMax700.subscribe((isMax700) => {
        this.isMax700 = isMax700;
        const padding = isMax700 ? '1.1rem 1.6rem' : '1.1rem 2.7rem';
        this.renderer.setStyle(this.el.nativeElement, 'padding', padding);
      });

    this.subscription.add(responsiveSubscription);
  }

  @HostListener('mouseover') onMouseOver() {
    this.applyHoverStyles();
  }

  @HostListener('mouseout') onMouseOut() {
    this.applyDefaultStyles();
  }
}
