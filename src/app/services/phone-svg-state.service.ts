import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformLink } from '../shared/models/platform-options.model';

interface SvgState {
  profile: {
    name: string;
    email: string;
    avatarPath: string;
  };
  links: PlatformLink[];
}

const initialState: SvgState = {
  profile: {
    name: '',
    email: '',
    avatarPath: '',
  },
  links: [],
};

@Injectable({
  providedIn: 'root',
})
export class PhoneSvgStateService {
  private svgState = new BehaviorSubject<SvgState>(initialState);
  state$ = this.svgState.asObservable();

  constructor() {}

  updateProfile(profile: { name: string; email: string; avatarPath: string }) {
    const currentState = this.svgState.getValue();
    const newState = {
      ...currentState,
      profile: { ...currentState.profile, ...profile },
    };
    this.svgState.next(newState);
  }

  updateLinks(links: PlatformLink[]) {
    const currentState = this.svgState.getValue();
    const newState = {
      ...currentState,
      links: links,
    };
    this.svgState.next(newState);
  }
}
