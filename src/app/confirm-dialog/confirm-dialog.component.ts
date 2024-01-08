import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';
import { ResponsiveService } from '../services/responsive.service';

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
    private responsiveService: ResponsiveService
  ) {}

  onDiscard(): void {
    this.dialogRef.close('discard');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
