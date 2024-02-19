import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  OnInit,
  OnDestroy,
  Input,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';

@Directive({
  selector: '[appOutlineBtn]',
})
export class OutlineBtnDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private responsiveService = inject(ResponsiveService);
  private _isDisabled: boolean = false;
  @Input()
  set disabled(value: string | boolean) {
    this._isDisabled = value === '' || value === true || value === 'true';
    this.updateDisabledState();
  }
  private subscription = new Subscription();

  ngOnInit(): void {
    this.setupStyles();
    this.setupResponsiveStyles();
    this.updateDisabledState();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private updateDisabledState(): void {
    if (this._isDisabled) {
      this.renderer.addClass(this.el.nativeElement, 'disabled');
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.25');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
      this.renderer.setStyle(
        this.el.nativeElement,
        'backgroundColor',
        'transparent'
      );
      this.renderer.setStyle(this.el.nativeElement, 'pointerEvents', 'none'); // Disables hover and click events
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'disabled');
      this.renderer.removeStyle(this.el.nativeElement, 'opacity');
      this.renderer.removeStyle(this.el.nativeElement, 'pointerEvents');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    }
  }

  private setupStyles(): void {
    const baseStyles = {
      borderColor: 'var(--primary)',
      color: 'var(--primary)',
      fontWeight: '600',
      fontSize: '1.6rem',
      borderRadius: '0.8rem',
      borderStyle: 'solid',
      borderWidth: '1px',
      backgroundColor: 'transparent',
      transition: 'background-color 0.3s ease, border-color 0.3s ease',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    };
    this.setStyles(baseStyles);
  }

  private setStyles(styles: { [key: string]: string }): void {
    Object.keys(styles).forEach((property) => {
      this.renderer.setStyle(this.el.nativeElement, property, styles[property]);
    });
  }

  private setupResponsiveStyles(): void {
    this.subscription.add(
      this.responsiveService.isCustomMax700.subscribe((isMax700) => {
        const padding = isMax700 ? '1.1rem 1.6rem' : '1.1rem 2.7rem';
        this.renderer.setStyle(this.el.nativeElement, 'padding', padding);
      })
    );
  }

  @HostListener('mouseover') onMouseOver() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#EFEBFF');
  }

  @HostListener('mouseout') onMouseOut() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      'transparent'
    );
  }
}
