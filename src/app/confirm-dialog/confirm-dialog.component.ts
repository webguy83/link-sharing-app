import { Component, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

interface DialogData {
  heading: string;
  description: string;
  showDiscardButton: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, SharedModule],
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  mobile420$ = this.responsiveService.isCustomMax420;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private responsiveService: ResponsiveService
  ) {}

  onDiscard(): void {
    this.dialogRef.close('discard');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
