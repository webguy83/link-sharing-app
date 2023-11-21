import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStyleDirective } from './directives/form-style.directive';
import { PrimaryBtnDirective } from './directives/primary-btn.directive';

@NgModule({
  declarations: [FormStyleDirective, PrimaryBtnDirective],
  imports: [CommonModule],
  exports: [FormStyleDirective, CommonModule, PrimaryBtnDirective],
})
export class SharedModule {}
