import {
  Directive,
  ElementRef,
  Renderer2,
  HostListener,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[appPrimaryBtn]',
})
export class PrimaryBtnDirective implements AfterViewInit, OnDestroy {
  private mutationObserver!: MutationObserver;
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }
  ngAfterViewInit(): void {
    this.mutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'disabled') {
            this.checkAndApplyDisabledStyles();
          }
        });
      }
    );
    this.mutationObserver.observe(this.el.nativeElement, {
      attributes: true,
      attributeFilter: ['disabled'],
    });

    this.applyStyles();
    this.checkAndApplyDisabledStyles();
  }

  public resetButtonStyles(): void {
    this.setDefaults();
  }

  private setDefaults() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      'var(--primary)'
    );
    this.renderer.removeStyle(this.el.nativeElement, 'opacity');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  private applyStyles(): void {
    const styles: { [key: string]: string } = {
      fontSize: '1.6rem',
      color: 'var(--white)',
      backgroundColor: 'var(--primary)',
      border: 'none',
      borderRadius: '0.8rem',
      padding: '1.1rem 2.7rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    };

    Object.keys(styles).forEach((property) => {
      this.renderer.setStyle(this.el.nativeElement, property, styles[property]);
    });
  }

  private checkAndApplyDisabledStyles(): void {
    if (this.el.nativeElement.disabled) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'backgroundColor',
        'var(--secondary)'
      );
      this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.25');
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');
    } else {
      this.setDefaults();
    }
  }

  @HostListener('mouseover') onMouseOver() {
    if (!this.el.nativeElement.disabled) {
      this.renderer.setStyle(
        this.el.nativeElement,
        'backgroundColor',
        'var(--secondary)'
      );
    }
  }

  @HostListener('mouseout') onMouseOut() {
    this.checkAndApplyDisabledStyles();
  }

  @HostListener('change') onChange() {
    this.checkAndApplyDisabledStyles();
  }
}
