import { LinkDataStyled, Profile } from '../shared/models/basics.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private initialLinksSubject = new BehaviorSubject<LinkDataStyled[]>([
    {
      platform: 'github',
      profileUrl: 'http://www.github.com',
      bgColour: '#1A1A1A',
      iconFileName: 'icon-github.svg',
      label: 'GitHub',
    },
    {
      platform: 'linkedin',
      profileUrl: 'http://www.linkedin.com',
      bgColour: '#2D68FF',
      iconFileName: 'icon-linkedin.svg',
      label: 'LinkedIn',
    },
    {
      platform: 'youtube',
      profileUrl: 'http://www.youtube.com',
      bgColour: '#EE3939',
      iconFileName: 'icon-youtube.svg',
      label: 'YouTube',
    },
    {
      platform: 'twitch',
      profileUrl: 'http://www.twitch.tv',
      bgColour: '#EE3FC8',
      iconFileName: 'icon-twitch.svg',
      label: 'Twitch',
    },
  ]);
  // private initialProfileSubject = new BehaviorSubject<Profile>({
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   picture: null,
  // });
  private initialProfileSubject = new BehaviorSubject<Profile>({
    firstName: 'Curtis',
    lastName: 'Yacboski',
    email: 'curtis_102@hotmail.com',
    picture: null,
  });

  private linksSubject = new BehaviorSubject<LinkDataStyled[]>(
    this.initialLinksSubject.getValue()
  );
  private profileSubject = new BehaviorSubject<Profile>(
    this.initialProfileSubject.getValue()
  );

  initialLinks$ = this.initialLinksSubject.asObservable();
  links$ = this.linksSubject.asObservable();
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

  saveLinks(links: LinkDataStyled[]) {
    console.log(links);
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
