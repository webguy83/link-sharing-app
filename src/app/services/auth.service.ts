import { Injectable, inject } from '@angular/core';
import {
  Auth,
  user,
  User,
  authState,
  idToken,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // Observable of the current user
  user$: Observable<User | null> = user(this.auth);

  // Observable of the authentication state
  authState$: Observable<User | null> = authState(this.auth);

  // Observable of the ID token
  idToken$: Observable<string | null> = idToken(this.auth);

  isAuthenticated() {
    return this.user$.pipe(map((user) => !!user));
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }
}
