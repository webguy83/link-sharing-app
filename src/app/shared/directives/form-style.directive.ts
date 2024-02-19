import { Subscription } from 'rxjs';
import { ResponsiveService } from './../../services/responsive.service';
import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appFormStyle]',
})
export class FormStyleDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private responsiveService = inject(ResponsiveService);
  private subscription = new Subscription();

  ngOnInit(): void {
    this.applyStyleToInputs();
    this.subscription.add(
      this.responsiveService.isCustomMax400.subscribe((isMax400) => {
        this.updateBreakpointClass(isMax400, 'mobile-xsmall');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private applyStyleToInputs(): void {
    const formGroupElm = this.el.nativeElement;
    this.renderer.addClass(formGroupElm, 'custom-form-group-style');
  }

  private updateBreakpointClass(condition: boolean, className: string): void {
    if (condition) {
      this.renderer.addClass(this.el.nativeElement, className);
    } else {
      this.renderer.removeClass(this.el.nativeElement, className);
    }
  }
}
