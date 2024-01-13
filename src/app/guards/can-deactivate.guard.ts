// can-deactivate.guard.ts

import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UnsavedChangesComponent } from '../shared/models/unsaved-changes.interface';
import { map, of } from 'rxjs';

export const canDeactivateUnsavedChanges: CanDeactivateFn<
  UnsavedChangesComponent
> = (component: UnsavedChangesComponent) => {
  if (component.hasUnsavedChanges()) {
    const dialogRef = inject(MatDialog).open(ConfirmDialogComponent, {
      data: {
        heading: 'Unsaved Changes',
        description:
          'You have unsaved changes! Are you sure you want to discard changes?',
        showDiscardButton: true,
      },
    });

    // Handle the dialog result
    return dialogRef.afterClosed().pipe(
      map((result) => {
        switch (result) {
          case 'discard':
            // Directly call discardChanges as it's part of the interface
            component.discardChanges();
            return true; // Allow navigation after discarding changes
          case 'cancel':
            return false; // Prevent navigation on cancel
          default:
            return false; // Treat other cases as cancel
        }
      })
    );
  }
  component.discardChanges();
  return of(true); // Allow navigation if no unsaved changes
};
