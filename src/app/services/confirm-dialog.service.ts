import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  openConfirmDialog(): Observable<string> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        heading: 'Unsaved Changes',
        description:
          'You have unsaved changes! Are you sure you want to discard changes?',
        showDiscardButton: true,
      },
    });

    return dialogRef.afterClosed();
  }
}
