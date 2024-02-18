import { LinkBlock, Profile } from '../shared/models/basics.model';
import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private initialLinksSubject = new BehaviorSubject<LinkBlock[]>([]);
  private initialProfileSubject = new BehaviorSubject<Profile>({
    firstName: '',
    lastName: '',
    email: '',
    picture: null,
  });

  private hasUnsavedChangesSignal = signal(false);

  setUnsavedChanges(isUnsaved: boolean) {
    this.hasUnsavedChangesSignal.set(isUnsaved);
  }

  hasUnsavedChanges() {
    return computed(() => this.hasUnsavedChangesSignal());
  }

  private linksSubject = new BehaviorSubject<LinkBlock[]>(
    this.initialLinksSubject.getValue()
  );
  private profileSubject = new BehaviorSubject<Profile>(
    this.initialProfileSubject.getValue()
  );

  initialLinks$ = this.initialLinksSubject.asObservable();
  links$ = this.linksSubject.asObservable().pipe(
    map((links) => {
      return links.map((link) => {
        return {
          ...link,
          iconFileName: `../../assets/images/alternate/${link.iconFileName}`,
        };
      });
    })
  );
  initialProfile$ = this.initialProfileSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  synchronizeLinksToInitial(): void {
    const initialLinks = this.initialLinksSubject.getValue();
    this.linksSubject.next(initialLinks);
  }

  synchronizeProfileToInitial(): void {
    const initialProfile = this.initialProfileSubject.getValue();
    this.profileSubject.next(initialProfile);
  }

  saveLinks(links: LinkBlock[]) {
    this.initialLinksSubject.next(links);
  }

  saveProfile(profile: Profile) {
    this.initialProfileSubject.next(profile);
  }

  updateLinks(links: LinkBlock[]) {
    this.linksSubject.next(links);
  }

  updateProfile(profile: Profile) {
    this.profileSubject.next(profile);
  }
}
