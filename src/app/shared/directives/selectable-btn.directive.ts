import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appSelectableButton]',
})
export class SelectableButtonDirective implements OnInit, OnChanges {
  @Input() isSelected: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.applyDefaultStyles();
    this.applyStylesBasedOnSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSelected']) {
      this.applyStylesBasedOnSelection();
    }
  }

  private applyStylesBasedOnSelection(): void {
    if (this.isSelected) {
      this.applySelectedStyles();
    } else {
      this.applyDefaultStyles();
    }
  }

  private setIconColor(color: string): void {
    const icon = this.el.nativeElement.querySelector('.icon');
    if (icon) {
      const path = icon.querySelector('path');
      if (path) {
        this.renderer.setStyle(path, 'transition', 'fill 0.3s ease');
        this.renderer.setStyle(path, 'fill', color);
      }
    }
  }

  private applyDefaultStyles(): void {
    const styles: { [key: string]: string } = {
      borderRadius: '.8rem',
      fontSize: '1.6rem',
      fontWeight: '600',
      color: 'var(--med-gray)',
      padding: '1.1rem 2.7rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.8rem',
      transition: 'color 0.3s ease, background-color 0.3s ease',
    };
    this.setStyles(styles);
    this.setIconColor('var(--med-gray)');
  }

  private applyHoverStyles(): void {
    const styles: { [key: string]: string } = {
      color: 'var(--primary)',
    };
    this.setStyles(styles);
    this.setIconColor('var(--primary)');
  }

  private applySelectedStyles(): void {
    const styles: { [key: string]: string } = {
      backgroundColor: 'var(--light-purple)',
      color: 'var(--primary)',
      cursor: 'default',
    };
    this.setStyles(styles);
    this.setIconColor('var(--primary)');
  }

  private setStyles(styles: { [key: string]: string }): void {
    Object.keys(styles).forEach((property) => {
      this.renderer.setStyle(this.el.nativeElement, property, styles[property]);
    });
  }

  @HostListener('mouseover') onMouseOver() {
    if (!this.isSelected) {
      this.applyHoverStyles();
    }
  }

  @HostListener('mouseout') onMouseOut() {
    this.applyStylesBasedOnSelection();
  }

  @HostListener('click') onClick() {
    // Emit an event or call a method to notify other components to update
  }
}
