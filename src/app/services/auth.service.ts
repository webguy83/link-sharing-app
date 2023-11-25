import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  Auth,
  UserCredential,
} from 'firebase/auth';
import { from, Observable, scheduled, asyncScheduler, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;
  private static readonly AUTH_KEY = 'authToken';

  constructor(private localStorageService: LocalStorageService) {
    this.auth = getAuth();
  }

  isAuthenticated(): boolean {
    const token = this.localStorageService.getItem<string>(
      AuthService.AUTH_KEY
    );
    return Boolean(token);
  }

  saveAuthToken(token: string): void {
    this.localStorageService.setItem(AuthService.AUTH_KEY, token);
  }

  clearAuthToken(): void {
    this.localStorageService.removeItem(AuthService.AUTH_KEY);
  }

  private handleUserCredential(userCredential: UserCredential) {
    return from(userCredential.user.getIdToken()).pipe(
      switchMap((token) => {
        this.saveAuthToken(token);
        return from([userCredential]);
      })
    );
  }

  signIn(email: string, password: string) {
    // Use 'from' to convert the promise returned by signInWithEmailAndPassword into an observable
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => this.handleUserCredential(userCredential))
    );
  }

  signUp(email: string, password: string) {
    // Use 'from' to convert the promise returned by createUserWithEmailAndPassword into an observable
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential) => this.handleUserCredential(userCredential))
    );
  }

  signOut() {
    return from(signOut(this.auth)).pipe(
      switchMap(() => {
        this.clearAuthToken();
        return from([null]);
      })
    );
  }
}
