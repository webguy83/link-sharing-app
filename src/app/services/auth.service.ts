import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { from, switchMap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private static readonly AUTH_KEY = 'authToken';

  constructor(private localStorageService: LocalStorageService) {}

  isAuthenticated(): boolean {
    const token = this.localStorageService.getItem<string>(
      AuthService.AUTH_KEY
    );
    return !!token;
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
        this.saveAuthToken(token); // Save the token
        return [userCredential]; // Return the original UserCredential
      })
    );
  }

  signIn(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((userCredential) => this.handleUserCredential(userCredential))
    );
  }

  signUp(email: string, password: string) {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential) => this.handleUserCredential(userCredential))
    );
  }

  signOut() {
    const signOutPromise = signOut(this.auth).then(() => {
      this.clearAuthToken(); // Clear the token when signing out
    });
    return from(signOutPromise);
  }
}
