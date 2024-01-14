import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Profile } from '../shared/models/basics.model';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent implements OnChanges {
  @Input() profile: Profile = {
    firstName: '',
    lastName: '',
    email: '',
    picture: null,
  };
  profilePictureUrl: string | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['profile'] && this.profile.picture) ||
      this.profile.picture === null
    ) {
      this.updateProfilePictureUrl();
    }
  }

  private updateProfilePictureUrl() {
    if (this.profile.picture) {
      // Release the previous URL to avoid memory leaks
      if (this.profilePictureUrl) {
        URL.revokeObjectURL(this.profilePictureUrl);
      }
      this.profilePictureUrl = URL.createObjectURL(this.profile.picture);
    } else {
      this.profilePictureUrl = null;
    }
  }

  get firstNameInitial(): string {
    return this.profile.firstName.charAt(0).toUpperCase();
  }

  get lastNameInitial(): string {
    return this.profile.lastName.charAt(0).toUpperCase();
  }
}
