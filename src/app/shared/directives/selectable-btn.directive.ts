import {
  Directive,
  ElementRef,
  Renderer2,
  Input,
  HostListener,
  OnInit,
  OnDestroy,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponsiveService } from '../../services/responsive.service';

@Directive({
  selector: '[appSelectableButton]',
})
export class SelectableButtonDirective implements OnInit, OnDestroy, OnChanges {
  @Input() isSelected: boolean = false;
  private isMax350 = false;
  private subscription: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private responsiveService: ResponsiveService
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.responsiveService.isCustomMax350.subscribe((isMax350) => {
        this.isMax350 = isMax350;
        this.applyStylesBasedOnSelection();
      })
    );

    this.applyStylesBasedOnSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSelected']) {
      this.applyStylesBasedOnSelection();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private applyStylesBasedOnSelection(): void {
    this.isSelected ? this.applySelectedStyles() : this.applyDefaultStyles();
  }

  private applyDefaultStyles(): void {
    this.setButtonStyles(
      'var(--med-gray)',
      'transparent',
      'pointer',
      this.isMax350 ? '1.1rem' : '1.1rem 2.7rem'
    );
  }

  private applyHoverStyles(): void {
    this.setButtonStyles(
      'var(--primary)',
      'transparent',
      'pointer',
      this.isMax350 ? '1.1rem' : '1.1rem 2.7rem'
    );
  }

  private applySelectedStyles(): void {
    this.setButtonStyles(
      'var(--primary)',
      'var(--light-purple)',
      'default',
      this.isMax350 ? '1.1rem' : '1.1rem 2.7rem'
    );
  }

  private setButtonStyles(
    color: string,
    backgroundColor: string,
    cursor: string,
    padding: string
  ): void {
    const styles = {
      borderRadius: '.8rem',
      fontSize: '1.6rem',
      fontWeight: '600',
      color,
      padding,
      backgroundColor,
      border: 'none',
      cursor,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.8rem',
      transition: 'color 0.3s ease, background-color 0.3s ease',
    };

    this.setStyles(styles);
    this.setIconColor(color);
  }

  private setIconColor(color: string): void {
    const icon = this.el.nativeElement.querySelector('.icon');
    const path = icon?.querySelector('path');
    if (path) {
      this.renderer.setStyle(path, 'transition', 'fill 0.3s ease');
      this.renderer.setStyle(path, 'fill', color);
    }
  }

  private setStyles(styles: { [key: string]: string }): void {
    Object.keys(styles).forEach((property) => {
      this.renderer.setStyle(this.el.nativeElement, property, styles[property]);
    });
  }

  @HostListener('mouseover') onMouseOver(): void {
    if (!this.isSelected) {
      this.applyHoverStyles();
    }
  }

  @HostListener('mouseout') onMouseOut(): void {
    this.applyStylesBasedOnSelection();
  }
}
