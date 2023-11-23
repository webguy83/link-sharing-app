import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStyleDirective } from './directives/form-style.directive';
import { PrimaryBtnDirective } from './directives/primary-btn.directive';
import { SelectableButtonDirective } from './directives/selectable-btn.directive';
import { OutlineBtnDirective } from './directives/outline-btn.directive';

@NgModule({
  declarations: [
    FormStyleDirective,
    PrimaryBtnDirective,
    SelectableButtonDirective,
    OutlineBtnDirective,
  ],
  imports: [CommonModule],
  exports: [
    FormStyleDirective,
    CommonModule,
    PrimaryBtnDirective,
    SelectableButtonDirective,
    OutlineBtnDirective,
  ],
})
export class SharedModule {}
