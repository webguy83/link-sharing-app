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
import { platformOptions } from '../shared/constants/platform-options';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { linkPlatformValidator } from '../validators/validators';

interface DropdownInfo {
  isOpen: boolean;
  placeholder: string;
  iconPath: string;
}

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
})
export class LinksComponent implements OnDestroy {
  private subscription = new Subscription();
  dropdownsInfo: DropdownInfo[] = [];
  formSubmitted = false;
  linksForm = this.fb.group({
    linkItems: this.fb.array([]),
  });
  isFormChanged = false;
  platformOptions = platformOptions;
  isDropdownOpen: boolean = false;
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

  toggleDropdown(index: number): void {
    // Close all other dropdowns
    this.dropdownsInfo.forEach((info, i) => {
      if (i !== index) info.isOpen = false;
    });
    // Toggle the specified dropdown
    this.dropdownsInfo[index].isOpen = !this.dropdownsInfo[index].isOpen;
  }

  subscribeToFormChanges() {
    this.subscription.add(
      this.linksForm.valueChanges.subscribe(() => {
        this.isFormChanged = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addLink() {
    const firstPlatformOption = this.platformOptions[0];
    const linkItem = this.fb.group(
      {
        platform: [firstPlatformOption.value, Validators.required],
        link: ['', Validators.required],
      },
      { validators: linkPlatformValidator }
    );

    this.subscription.add(
      linkItem.valueChanges
        .pipe(
          distinctUntilChanged() // Add this to prevent unnecessary calls
        )
        .subscribe(() => {
          const linkControl = linkItem.get('link');
          if (linkControl) {
            if (linkItem.errors && linkItem.errors['invalidLinkPlatform']) {
              // Use setErrors with emitEvent: false to prevent a loop
              linkControl.setErrors(
                { invalidLinkPlatform: true },
                { emitEvent: false }
              );
            } else {
              // Use updateValueAndValidity with emitEvent: false
              linkControl.updateValueAndValidity({ emitEvent: false });
            }
          }
        })
    );

    this.linkItems.push(linkItem);
    this.dropdownsInfo.push({
      isOpen: false,
      placeholder: firstPlatformOption.placeholder,
      iconPath: firstPlatformOption.iconPath,
    });

    this.formSubmitted = false;
  }

  removeLink(index: number): void {
    this.linkItems.removeAt(index);
  }

  showError(index: number): string {
    const linkControl = this.linkItems.at(index).get('link');
    if (linkControl && this.formSubmitted) {
      if (linkControl.hasError('required') || linkControl.value === '') {
        return "Can't be empty";
      } else if (linkControl.hasError('invalidLinkPlatform')) {
        return 'Please check the URL';
      }
    }
    return '';
  }

  onPlatformChange(index: number, event: any): void {
    const platformControl = this.linkItems.at(index).get('platform');
    const linkControl = this.linkItems.at(index).get('link');

    if (platformControl && linkControl) {
      const platformValue = event.target.value;
      const foundPlatform = this.platformOptions.find(
        (option) => option.value === platformValue
      );

      if (foundPlatform) {
        this.dropdownsInfo[index].iconPath = foundPlatform.iconPath;
        this.dropdownsInfo[index].placeholder = foundPlatform.placeholder;
        platformControl.setValue(platformValue); // Safely set the value of the control
        linkControl.reset(); // Reset the link control
      }
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.linksForm.valid) {
      this.formSubmitted = false;
      this.isFormChanged = false;
    } else {
      this.scrollToFirstInvalidControl();
    }
  }

  scrollToFirstInvalidControl() {
    for (let i = 0; i < this.linkItems.length; i++) {
      const linkControl = this.linkItems.at(i).get('link');
      if (linkControl && linkControl.invalid) {
        // Find the HTML element
        const invalidControl = document.getElementById(`link-${i}`);
        if (invalidControl) {
          invalidControl.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          break;
        }
      }
    }
  }
}
