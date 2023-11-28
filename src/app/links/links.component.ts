import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.scss',
})
export class LinksComponent {
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  linksForm: FormGroup;

  constructor(
    private responsiveService: ResponsiveService,
    private fb: FormBuilder
  ) {
    this.linksForm = this.fb.group({
      links: this.fb.array([]),
    });
  }

  get links(): FormArray {
    return this.linksForm.get('links') as FormArray;
  }

  addLink(): void {
    const linkFormGroup = this.fb.group({
      platform: [''],
      url: [''],
    });
    this.links.push(linkFormGroup);
  }

  removeLink(index: number): void {
    this.links.removeAt(index);
  }

  onSubmit(): void {
    // Process the form data here
    console.log(this.linksForm.value);
  }
}
