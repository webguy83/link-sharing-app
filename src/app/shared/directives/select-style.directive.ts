import { Directive, ElementRef, Renderer2, OnInit } from '@angular/core';

@Directive({
  selector: '[appSelectStyle]',
  standalone: true,
})
export class SelectStyleDirective implements OnInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.setStyle();
  }

  private setStyle(): void {
    const selectElement = this.el.nativeElement;

    // Add classes to the native element
    this.renderer.addClass(selectElement, 'form-select');

    // Set styles directly on the element
    this.renderer.setStyle(selectElement, 'borderRadius', '0.8rem');
    this.renderer.setStyle(selectElement, 'fontSize', '1.6rem');
    this.renderer.setStyle(selectElement, 'fontWeight', '600');
    this.renderer.setStyle(selectElement, 'color', 'var(--med-gray)');
    this.renderer.setStyle(selectElement, 'padding', '1.1rem 2.7rem');
    this.renderer.setStyle(selectElement, 'backgroundColor', 'transparent');
    // ... Add more styles as needed

    // You can also conditionally apply styles based on component logic
    // For instance, if you have a property to check if the form control is valid/invalid
    // this.renderer.setStyle(selectElement, 'border', isValid ? '1px solid green' : '1px solid red');
  }
}
