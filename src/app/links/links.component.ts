import { PhoneSvgStateService } from './../services/phone-svg-state.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { PlatformLink } from '../shared/models/platform-options.model';

interface DropdownInfo {
  isOpen: boolean;
  placeholder: string;
  iconFileName: string;
}

interface FormControlValue {
  platform: string;
  link: string;
}

type PlatformOptionsLookup = { [key: string]: PlatformLink };

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss'],
  animations: [
    trigger('removalAnimation', [
      state('in', style({ opacity: 1, height: '*' })),
      transition('* => void', [
        animate('0.3s ease-out', style({ opacity: 0, height: '0px' })),
      ]),
    ]),
  ],
})
export class LinksComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  dropdownsInfo: DropdownInfo[] = [];
  removingStates: boolean[] = [];
  formSubmitted = false;
  linksForm = this.fb.group({
    linkItems: this.fb.array([]),
  });
  isFormChanged = false;
  platformOptions = platformOptions;
  platformOptionsLookup: PlatformOptionsLookup = {};
  isDropdownOpen: boolean = false;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;

  constructor(
    private fb: FormBuilder,
    private responsiveService: ResponsiveService,
    private phoneSvgStateService: PhoneSvgStateService
  ) {
    this.subscribeToFormChanges();
  }
  ngOnInit(): void {
    this.platformOptionsLookup = platformOptions.reduce((acc, option) => {
      acc[option.value] = {
        bgColour: option.bgColour,
        iconFileName: option.iconFileName,
        platform: option.label,
      };
      return acc;
    }, {} as PlatformOptionsLookup);
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
        link: [null, Validators.required],
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

    const mappedItems = this.mapToPlatformLinks(this.linkItems);
    console.log(mappedItems);

    this.dropdownsInfo.push({
      isOpen: false,
      placeholder: firstPlatformOption.placeholder,
      iconFileName: firstPlatformOption.iconFileName,
    });

    this.phoneSvgStateService.updateLinks([]);

    // Initialize the removing state for the new link
    this.removingStates.push(false);

    const newItemIndex = this.linkItems.length - 1;
    const newItem = document.getElementById(`link-item-${newItemIndex}`);
    if (newItem) {
      newItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    this.formSubmitted = false;
  }

  private mapToPlatformLinks(linkItems: FormArray): PlatformLink[] {
    const formControlsValues: FormControlValue[] = linkItems.getRawValue();

    return formControlsValues.map((control: FormControlValue) => {
      const platformLink = this.platformOptionsLookup[control.platform];

      // Construct the new PlatformLink object
      return {
        platform: platformLink.platform,
        link: control.link,
        bgColour: platformLink.bgColour,
        iconFileName: platformLink.iconFileName,
      };
    });
  }

  removeLink(index: number): void {
    this.removingStates[index] = true; // Start the removal animation

    setTimeout(() => {
      this.linkItems.removeAt(index);
      this.removingStates.splice(index, 1);
      // Also update any other related arrays or states as necessary
    }, 100); // Duration matching the animation
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
        this.dropdownsInfo[index].iconFileName = foundPlatform.iconFileName;
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

  drop(event: CdkDragDrop<string[]>): void {
    const { previousIndex, currentIndex } = event;
    if (previousIndex !== currentIndex && !this.isFormChanged) {
      this.isFormChanged = true;
    }
    moveItemInArray(this.linkItems.controls, previousIndex, currentIndex);
    moveItemInArray(this.dropdownsInfo, previousIndex, currentIndex);
    moveItemInArray(this.removingStates, previousIndex, currentIndex);
  }
}
