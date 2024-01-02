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

const initState = {
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
  private initialState = new BehaviorSubject<AppState>(initState);
  private state = new BehaviorSubject<AppState>(initState);

  state$ = this.state.asObservable();
  initialState$ = this.initialState.asObservable();

  saveInitialState(): void {
    this.initialState.next(this.state.getValue());
  }

  updateProfile(profile: { name: string; email: string; avatarPath: string }) {
    const currentState = this.state.getValue();
    const newState: AppState = {
      ...currentState,
      profile: { ...currentState.profile, ...profile },
    };
    this.state.next(newState);
  }

  updateLinks(links: PlatformLink[]) {
    const currentState = this.state.getValue();
    const newState: AppState = {
      ...currentState,
      links: links,
    };
    this.state.next(newState);
  }
}
