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
    const dialogRef = inject(MatDialog).open(ConfirmDialogComponent);

    // Handle the dialog result
    return dialogRef.afterClosed().pipe(
      map((result) => {
        // If result is undefined (clicking outside), treat it as cancellation
        return result === true;
      })
    );
  }
  return of(true); // Allow navigation if no unsaved changes
};
