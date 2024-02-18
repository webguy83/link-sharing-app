import { ConfirmDialogService } from './../services/confirm-dialog.service';
import { NotificationService } from './../services/notification.service';
import { AppStateService } from '../services/state.service';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import {
  FormBuilder,
  FormArray,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { platformOptions } from '../shared/constants/platform-options';
import { Subscription, distinctUntilChanged, finalize, take } from 'rxjs';
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
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormStateService } from '../services/form-state.service';

interface AdditionalLinkState {
  isOpen: boolean;
  placeholder: string;
  iconFileName: string;
}

@Component({
  selector: 'app-links',
  standalone: true,
  imports: [SharedModule, ReactiveFormsModule, DragDropModule],
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
export class LinksComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();
  additionalLinkStates: AdditionalLinkState[] = [];
  private fb = inject(FormBuilder);
  private responsiveService = inject(ResponsiveService);
  private appStateService = inject(AppStateService);
  private linksService = inject(LinksService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private formStateService = inject(FormStateService);
  private confirmDialogService = inject(ConfirmDialogService);
  userId: string | null = null;
  formSubmitted = false;
  linksForm!: FormGroup;
  hasFormChanged = this.formStateService.formChanged;
  formSaving = false;
  platformOptions = platformOptions;
  isMaxWidth500$ = this.responsiveService.isCustomMax500;
  getErrorId = getErrorId;

  @ViewChildren('linkItem') linkItemsElements!: QueryList<ElementRef>;

  ngOnInit(): void {
    this.initializeForm();
    this.subscribeToFormChanges();
    this.populateAdditionalLinkStates();

    this.subscriptions.add(
      this.authService.user$.subscribe((user) => {
        this.userId = user ? user.uid : null;
      })
    );
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
      this.appStateService.initialLinks$.pipe(take(1)).subscribe((links) => {
        this.appStateService.updateLinks(links);
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
        this.formStateService.setFormChanged(true);
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

  onSignOut() {
    this.confirmDialogService
      .openConfirmDialog({
        heading: 'Sign Out',
        description: 'Are you sure you want to sign out?',
        showDiscardButton: true,
        confirmBtnText: 'Yes',
        cancelBtnText: 'No',
      })
      .subscribe((status) => {
        if (status === 'discard') {
          this.authService.signOut().subscribe({
            next: () => {
              this.notificationService.showNotification(
                'You have been successfully signed out!'
              );
            },
            error: () => {
              this.notificationService.showNotification('Unable to sign out!');
            },
          });
        }
      });
  }

  onSubmit(): void {
    this.formSubmitted = true;
    if (this.linksForm.valid && this.userId) {
      this.formSaving = true;
      const mappedItems = this.linksService.mapToPlatformLinks(this.linkItems);
      this.userService
        .createUserLinks(this.userId, mappedItems)
        .pipe(
          finalize(() => {
            this.formSaving = false;
          })
        )
        .subscribe({
          next: () => {
            this.formSubmitted = false;
            this.formStateService.setFormChanged(false);
            this.notificationService.showNotification(
              'Your changes have been successfully saved!',
              '../../assets/images/icon-changes-saved.svg'
            );
            this.appStateService.saveLinks(mappedItems);
          },
          error: () => {
            this.notificationService.showNotification(
              'Error saving changes! Please try again later.',
              '../../assets/images/icon-changes-saved.svg'
            );
          },
        });
    } else if (!this.userId) {
      this.router.navigate(['']);
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
    if (
      previousIndex !== currentIndex &&
      !this.formStateService.formChanged()
    ) {
      this.formStateService.setFormChanged(true);
    }
    moveItemInArray(this.linkItems.controls, previousIndex, currentIndex);
    moveItemInArray(this.additionalLinkStates, previousIndex, currentIndex);

    const mappedItems = this.linksService.mapToPlatformLinks(this.linkItems);
    this.appStateService.updateLinks(mappedItems);
  }
}
