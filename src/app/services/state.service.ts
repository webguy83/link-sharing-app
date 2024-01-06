import { PlatformLink } from './../shared/models/platform-options.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ProfileState {
  name: string;
  email: string;
  avatarPath: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private linksSubject = new BehaviorSubject<PlatformLink[]>([]);
  private profileSubject = new BehaviorSubject<ProfileState>({
    name: '',
    email: '',
    avatarPath: '',
  });

  links$ = this.linksSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  saveLinks(links: PlatformLink[]) {
    this.linksSubject.next(links);
  }

  updateLinks(links: PlatformLink[]) {
    this.linksSubject.next(links);
  }

  updateProfile(profile: ProfileState) {
    this.profileSubject.next(profile);
  }
}
