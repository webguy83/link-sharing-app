import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import {
  FormBuilder,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-option';
import { Subscription } from 'rxjs';
import { linkPlatformValidator } from '../validators/validators';

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnDestroy {
  private subscription = new Subscription();
  linksForm = this.fb.group({
    linkItems: this.fb.array([]),
  });
  isFormChanged = false;
  platformOptions = platformOptions;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;

  constructor(
    private fb: FormBuilder,
    private responsiveService: ResponsiveService
  ) {
    this.subscribeToFormChanges();
  }

  get linkItems() {
    return this.linksForm.controls['linkItems'] as FormArray;
  }

  subscribeToFormChanges() {
    this.subscription.add(
      this.linksForm.valueChanges.subscribe(() => {
        this.isFormChanged = true;
        console.log(this.linkItems.controls);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addLink() {
    const linkItem = this.fb.group(
      {
        platform: ['github', Validators.required],
        link: ['', Validators.required],
      },
      { validators: linkPlatformValidator }
    ); // Apply the custom validator

    this.linkItems.push(linkItem);
  }

  removeLink(index: number): void {
    this.linkItems.removeAt(index);
  }

  onPlatformChange(index: number): void {
    const linkFormGroup = this.linkItems.at(index);
    const linkControl = linkFormGroup.get('link');
    const platformControl = linkFormGroup.get('platform');

    // if (linkControl && platformControl) {
    //   linkControl.setValidators([
    //     Validators.required,
    //     linkPlatformValidator,
    //   ]);
    //   linkControl.updateValueAndValidity();
    // }
  }

  onSubmit(): void {
    if (this.linksForm.valid) {
      this.isFormChanged = false;
    }
  }
}
