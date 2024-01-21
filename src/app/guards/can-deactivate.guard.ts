// can-deactivate.guard.ts

import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UnsavedChangesComponent } from '../shared/models/unsaved-changes.interface';
import { AuthService } from '../services/auth.service'; // Import your AuthService
import { map, of, switchMap } from 'rxjs';

export const canDeactivateUnsavedChanges: CanDeactivateFn<
  UnsavedChangesComponent
> = (component: UnsavedChangesComponent) => {
  const authService = inject(AuthService);
  const dialog = inject(MatDialog);

  return authService.isAuthenticated().pipe(
    switchMap((isAuthenticated) => {
      if (isAuthenticated && component.hasUnsavedChanges()) {
        // Show dialog only if user is authenticated and has unsaved changes
        const dialogRef = dialog.open(ConfirmDialogComponent, {
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
                component.discardChanges();
                return true; // Allow navigation after discarding changes
              case 'cancel':
                return false; // Prevent navigation on cancel
              default:
                return false; // Treat other cases as cancel
            }
          })
        );
      } else {
        component.discardChanges();
        return of(true); // Allow navigation if not authenticated or no unsaved changes
      }
    })
  );
};
