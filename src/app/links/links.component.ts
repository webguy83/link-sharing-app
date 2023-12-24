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
import { Subscription } from 'rxjs';
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

    this.linkItems.push(linkItem);
    this.dropdownsInfo.push({
      isOpen: false,
      placeholder: firstPlatformOption.placeholder,
      iconPath: firstPlatformOption.iconPath,
    });
  }

  removeLink(index: number): void {
    this.linkItems.removeAt(index);
  }

  onPlatformChange(index: number, event: any): void {
    const platformControl = this.linkItems.at(index).get('platform');

    if (platformControl) {
      const platformValue = event.target.value;
      const foundPlatform = platformOptions.find(
        (option) => option.value === platformValue
      );

      if (foundPlatform) {
        this.dropdownsInfo[index].iconPath = foundPlatform.iconPath;
        this.dropdownsInfo[index].placeholder = foundPlatform.placeholder;
        platformControl.setValue(platformValue); // Safely set the value of the control
      }
    }
  }

  onSubmit(): void {
    if (this.linksForm.valid) {
      this.isFormChanged = false;
    }
  }
}
