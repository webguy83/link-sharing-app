import { Injectable, inject } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
} from '@angular/router';
import { BehaviorSubject, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private router = inject(Router);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isLoadingSubject.next(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationError ||
        event instanceof NavigationCancel
      ) {
        this.isLoadingSubject.next(false);
      }
    });
  }
}
