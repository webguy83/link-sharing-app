import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-option';
import { LinkBlockComponent } from '../link-block/link-block.component';

@Component({
  selector: 'app-links',
  standalone: true,
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    LinkBlockComponent,
  ],
})
export class LinksComponent {
  linksForm: FormGroup;
  platformOptions = platformOptions;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;

  constructor(
    private fb: FormBuilder,
    private responsiveService: ResponsiveService
  ) {
    // Initialize the form here
    this.linksForm = this.fb.group({
      linkItems: this.fb.array([]),
    });

    // If you want to start with one link item
    this.addLink();
  }

  get linksFormArray(): FormArray {
    return this.linksForm.get('linkItems') as FormArray;
  }

  addLink(): void {
    const linkItem = this.fb.group({
      platform: ['', Validators.required], // assuming platform is required
      link: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]], // simple URL validation
    });

    this.linksFormArray.push(linkItem);
  }

  removeLink(index: number): void {
    this.linksFormArray.removeAt(index);
  }

  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  onSubmit(): void {
    // Handle form submission
    console.log(this.linksForm.value);
  }
}
