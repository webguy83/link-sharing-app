import {
  LinkDataStyled,
  ProfileState,
} from './../shared/models/platform-options.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private initialLinksSubject = new BehaviorSubject<LinkDataStyled[]>([]);
  private initialProfileSubject = new BehaviorSubject<ProfileState>({
    firstName: '',
    lastName: '',
    email: '',
    avatarPath: '',
  });
  private linksSubject = new BehaviorSubject<LinkDataStyled[]>(this.initialLinksSubject.getValue());
  private profileSubject = new BehaviorSubject<ProfileState>(this.initialProfileSubject.getValue());

  initialLinks$ = this.initialLinksSubject.asObservable();
  links$ = this.linksSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  synchronizeLinksToInitial(): void {
    const initialLinks = this.initialLinksSubject.getValue();
    this.linksSubject.next(initialLinks);
  }

  synchronizeProfileToInitial(): void {
    const initialProfile = this.initialProfileSubject.getValue();
    this.profileSubject.next(initialProfile);
  }

  saveLinks(links: LinkDataStyled[]) {
    this.initialLinksSubject.next(links);
  }

  updateLinks(links: LinkDataStyled[]) {
    this.linksSubject.next(links);
  }

  saveProfile(profile: ProfileState) {
    this.initialProfileSubject.next(profile);
  }

  updateProfile(profile: ProfileState) {
    this.profileSubject.next(profile);
  }
}
