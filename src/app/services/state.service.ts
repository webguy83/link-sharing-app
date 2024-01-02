import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlatformLink } from '../shared/models/platform-options.model';

interface AppState {
  profile: {
    name: string;
    email: string;
    avatarPath: string;
  };
  links: PlatformLink[];
}

const initialState: AppState = {
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
export class AppStateService {
  private state = new BehaviorSubject<AppState>(initialState);
  state$ = this.state.asObservable();

  constructor() {}

  updateProfile(profile: { name: string; email: string; avatarPath: string }) {
    const currentState = this.state.getValue();
    const newState = {
      ...currentState,
      profile: { ...currentState.profile, ...profile },
    };
    this.state.next(newState);
  }

  updateLinks(links: PlatformLink[]) {
    const currentState = this.state.getValue();
    const newState = {
      ...currentState,
      links: links,
    };
    this.state.next(newState);
  }
}
