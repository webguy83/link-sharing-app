import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationData } from '../shared/models/basics.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  showNotification(message: string, iconPath?: string): void {
    this.snackBar.openFromComponent<NotificationComponent, NotificationData>(
      NotificationComponent,
      {
        data: { message, iconPath },
        duration: 3000,
      }
    );
  }
}
