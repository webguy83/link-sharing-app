import { AppStateService } from '../services/state.service';
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
import { Subscription, distinctUntilChanged, take } from 'rxjs';
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

interface AdditionalLinkState {
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
  private subscriptions = new Subscription();
  additionalLinkStates: AdditionalLinkState[] = [];
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
    private appStateService: AppStateService,
    private linksService: LinksService
  ) {}

  hasUnsavedChanges(): boolean {
    return this.hasFormChanged;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
    this.populateAdditionalLinkStates();
  }

  private populateAdditionalLinkStates() {
    this.linkItems.controls.forEach(() => {
      this.additionalLinkStates.push(
        this.linksService.getAdditionalLinkState()
      );
    });
  }

  get linkItems() {
    return this.linksForm.get('linkItems') as FormArray;
  }

  private initializeForm(): void {
    this.subscriptions.add(
      this.appStateService.links$.pipe(take(1)).subscribe((links) => {
        const formGroups = links.map((link) => {
          const linkItem = this.linksService.createLinkFormGroup(link);
          this.addSubscriptionToLinkItem(linkItem);
          this.additionalLinkStates.push(
            this.linksService.getAdditionalLinkState(link.platform)
          );
          return linkItem;
        });
        this.linksForm = this.fb.group({
          linkItems: this.fb.array(formGroups),
        });
      })
    );
  }

  toggleDropdown(index: number): void {
    // Close all other dropdowns
    this.additionalLinkStates.forEach((info, i) => {
      if (i !== index) info.isOpen = false;
    });
    // Toggle the specified dropdown
    this.additionalLinkStates[index].isOpen =
      !this.additionalLinkStates[index].isOpen;
  }

  subscribeToFormChanges() {
    this.subscriptions.add(
      this.linksForm.valueChanges.subscribe(() => {
        this.hasFormChanged = true;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private addSubscriptionToLinkItem(linkItem: FormGroup) {
    this.subscriptions.add(
      linkItem.valueChanges
        .pipe(
          distinctUntilChanged() // Add this to prevent unnecessary calls
        )
        .subscribe(() => {
          const profileUrlControl = linkItem.get('profileUrl');
          if (profileUrlControl) {
            if (linkItem.errors && linkItem.errors['invalidLinkPlatform']) {
              // Use setErrors with emitEvent: false to prevent a loop
              profileUrlControl.setErrors(
                { invalidLinkPlatform: true },
                { emitEvent: false }
              );
            } else {
              profileUrlControl.updateValueAndValidity({ emitEvent: false });
            }
          }
        })
    );
  }

  addLink() {
    const linkItem = this.linksService.createLinkFormGroup();
    this.addSubscriptionToLinkItem(linkItem);
    this.linkItems.push(linkItem);
    this.additionalLinkStates.push(this.linksService.getAdditionalLinkState());
    this.updateLinksState(this.linkItems);
    this.scrollToNewLinkAdded();
    this.formSubmitted = false;
  }

  updateLinksState(items: FormArray) {
    const mappedItems = this.linksService.mapToPlatformLinks(items);
    this.appStateService.updateLinks(mappedItems);
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
    this.linkItems.removeAt(index);
    this.updateLinksState(this.linkItems);
    this.additionalLinkStates = this.additionalLinkStates.filter(
      (_, i) => i !== index
    );
  }

  showError(index: number): string {
    const profileUrlControl = this.linkItems.at(index).get('profileUrl');
    if (profileUrlControl && this.formSubmitted) {
      if (
        profileUrlControl.hasError('required') ||
        profileUrlControl.value === ''
      ) {
        return "Can't be empty";
      } else if (profileUrlControl.hasError('invalidLinkPlatform')) {
        return 'Please check the URL';
      }
    }
    return '';
  }

  onPlatformChange(index: number, event: any): void {
    const platformControl = this.linkItems.at(index).get('platform');
    const profileUrlControl = this.linkItems.at(index).get('profileUrl');

    if (platformControl && profileUrlControl) {
      const platformValue: string = event.target.value;
      this.linksService.updateLinkPlatform(
        platformControl,
        profileUrlControl,
        platformValue
      );
      this.additionalLinkStates[index] =
        this.linksService.getAdditionalLinkState(platformValue);
      this.updateLinksState(this.linkItems);
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.linksForm.valid) {
      this.formSubmitted = false;
      this.hasFormChanged = false;
      const mappedItems = this.linksService.mapToPlatformLinks(this.linkItems);
      this.appStateService.saveLinks(mappedItems);
    } else {
      this.scrollToFirstInvalidControl();
    }
  }

  scrollToFirstInvalidControl() {
    const linkControlsArray = this.linkItemsElements.toArray();

    for (const [index, control] of this.linkItems.controls.entries()) {
      const profileUrlControl = control.get('profileUrl');
      if (profileUrlControl && profileUrlControl.invalid) {
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
    moveItemInArray(this.additionalLinkStates, previousIndex, currentIndex);

    const mappedItems = this.linksService.mapToPlatformLinks(this.linkItems);
    this.appStateService.updateLinks(mappedItems);
  }
}
