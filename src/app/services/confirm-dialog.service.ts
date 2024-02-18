import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

interface DialogData {
  heading: string;
  description: string;
  showDiscardButton: boolean;
  confirmBtnText?: string;
  cancelBtnText?: string;
}
@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  openConfirmDialog(data: DialogData): Observable<string> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
    });

    return dialogRef.afterClosed();
  }
}
