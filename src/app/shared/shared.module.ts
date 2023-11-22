import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStyleDirective } from './directives/form-style.directive';
import { PrimaryBtnDirective } from './directives/primary-btn.directive';
import { SelectableButtonDirective } from './directives/selectable-btn.directive';

@NgModule({
  declarations: [
    FormStyleDirective,
    PrimaryBtnDirective,
    SelectableButtonDirective,
  ],
  imports: [CommonModule],
  exports: [
    FormStyleDirective,
    CommonModule,
    PrimaryBtnDirective,
    SelectableButtonDirective,
  ],
})
export class SharedModule {}
