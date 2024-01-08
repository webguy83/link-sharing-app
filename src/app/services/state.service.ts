import { LinkDataStyled } from './../shared/models/platform-options.model';
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
  private initialLinksSubject = new BehaviorSubject<LinkDataStyled[]>([]);
  private linksSubject = new BehaviorSubject<LinkDataStyled[]>([]);
  private profileSubject = new BehaviorSubject<ProfileState>({
    name: '',
    email: '',
    avatarPath: '',
  });

  initialLinks$ = this.initialLinksSubject.asObservable();
  links$ = this.linksSubject.asObservable();
  profile$ = this.profileSubject.asObservable();

  synchronizeLinksToInitial(): void {
    const initialLinks = this.initialLinksSubject.getValue();
    this.linksSubject.next(initialLinks);
  }

  saveLinks(links: LinkDataStyled[]) {
    this.initialLinksSubject.next(links);
  }

  updateLinks(links: LinkDataStyled[]) {
    this.linksSubject.next(links);
  }

  updateProfile(profile: ProfileState) {
    this.profileSubject.next(profile);
  }
}
