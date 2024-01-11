import {
  LinkDataStyled,
  Profile,
} from './../shared/models/platform-options.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private initialLinksSubject = new BehaviorSubject<LinkDataStyled[]>([]);
  private initialProfileSubject = new BehaviorSubject<Profile>({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: null,
  });
  private linksSubject = new BehaviorSubject<LinkDataStyled[]>(this.initialLinksSubject.getValue());
  private profileSubject = new BehaviorSubject<Profile>(this.initialProfileSubject.getValue());

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

  saveProfile(profile: Profile) {
    this.initialProfileSubject.next(profile);
  }

  updateProfile(profile: Profile) {
    this.profileSubject.next(profile);
  }
}
