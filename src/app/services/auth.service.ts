import { Injectable } from '@angular/core';
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth;

  constructor() {
    this.auth = getAuth();
    setPersistence(this.auth, browserLocalPersistence);
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable((subscriber) => {
      onAuthStateChanged(this.auth, (user) => subscriber.next(!!user));
    });
  }

  signIn(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signUp(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth));
  }
}
