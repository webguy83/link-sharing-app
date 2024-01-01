import { PhoneSvgStateService } from './../services/phone-svg-state.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-options';
import { Subscription, distinctUntilChanged } from 'rxjs';
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
import { LinksService } from './links.service';
import { getErrorId } from '../shared/constants/error-id';
import { UnsavedChangesComponent } from '../shared/models/unsaved-changes.interface';

interface DropdownInfo {
  isOpen: boolean;
  placeholder: string;
  iconFileName: string;
}

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
  providers: [LinksService],
})
export class LinksComponent
  implements OnDestroy, OnInit, UnsavedChangesComponent
{
  private subscription = new Subscription();
  dropdownsInfo: DropdownInfo[] = [];
  removingStates: boolean[] = [];
  formSubmitted = false;
  linksForm!: FormGroup;
  hasFormChanged = false;
  platformOptions = platformOptions;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  getErrorId = getErrorId;

  @ViewChildren('linkItem') linkItemsElements!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private responsiveService: ResponsiveService,
    private phoneSvgStateService: PhoneSvgStateService,
    private linksService: LinksService
  ) {}

  hasUnsavedChanges(): boolean {
    return this.hasFormChanged;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
    this.populateDropdownsInfo();
  }

  private populateDropdownsInfo() {
    this.linkItems.controls.forEach(() => {
      this.dropdownsInfo.push(this.linksService.createInitialDropdownInfo());
    });
  }

  get linkItems() {
    return this.linksForm.controls['linkItems'] as FormArray;
  }

  private initializeForm(): void {
    this.linksForm = this.fb.group({
      linkItems: this.fb.array([]),
    });
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
        this.hasFormChanged = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private addSubscriptionToLinkItem(linkItem: FormGroup) {
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
              linkControl.updateValueAndValidity({ emitEvent: false });
            }
          }
        })
    );
  }

  addLink() {
    const linkItem = this.linksService.createLinkFormGroup();
    this.addSubscriptionToLinkItem(linkItem);
    this.linkItems.push(linkItem);
    this.dropdownsInfo.push(this.linksService.createInitialDropdownInfo());
    this.updateLinksState();
    this.removingStates.push(false);
    this.scrollToNewLinkAdded();
    this.formSubmitted = false;
  }

  updateLinksState() {
    const mappedItems = this.linksService.mapToPlatformLinks(this.linkItems);
    this.phoneSvgStateService.updateLinks(mappedItems);
  }

  scrollToNewLinkAdded() {
    setTimeout(() => {
      const newItemElement = this.linkItemsElements.last?.nativeElement;
      if (newItemElement) {
        newItemElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  removeLink(index: number): void {
    this.removingStates[index] = true;
    this.linkItems.removeAt(index);
    this.removingStates.splice(index, 1);
    this.updateLinksState();
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
      const platformValue: string = event.target.value;
      this.linksService.updateLinkPlatform(
        platformControl,
        linkControl,
        platformValue
      );
      this.dropdownsInfo[index] =
        this.linksService.getDropdownInfoByPlatform(platformValue);
      this.updateLinksState();
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.linksForm.valid) {
      this.formSubmitted = false;
      this.hasFormChanged = false;
    } else {
      this.scrollToFirstInvalidControl();
    }
  }

  scrollToFirstInvalidControl() {
    const linkControlsArray = this.linkItemsElements.toArray();

    for (const [index, control] of this.linkItems.controls.entries()) {
      const linkControl = control.get('link');
      if (linkControl && linkControl.invalid) {
        // Use ElementRef to access the native element
        const invalidControlElement = linkControlsArray[index].nativeElement;
        invalidControlElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        break;
      }
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    const { previousIndex, currentIndex } = event;
    if (previousIndex !== currentIndex && !this.hasFormChanged) {
      this.hasFormChanged = true;
    }
    moveItemInArray(this.linkItems.controls, previousIndex, currentIndex);
    moveItemInArray(this.dropdownsInfo, previousIndex, currentIndex);
    moveItemInArray(this.removingStates, previousIndex, currentIndex);

    const mappedItems = this.linksService.mapToPlatformLinks(this.linkItems);
    this.phoneSvgStateService.updateLinks(mappedItems);
  }
}
