import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LinkBlock, Profile } from '../shared/models/basics.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  createUserProfile(userId: string, profile: Profile): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userDocRef, { profile }, { merge: true }));
  }

  createUserLinks(userId: string, links: LinkBlock[]): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    if (links.length === 0) {
      // If the links array is empty, remove the 'links' field from the document
      return from(updateDoc(userDocRef, { links: deleteField() }));
    }
    return from(setDoc(userDocRef, { links }, { merge: true }));
  }

  uploadProfilePicture(userId: string, file: File): Observable<string> {
    const filePath = `profilePictures/${userId}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    return from(uploadBytes(fileRef, file)).pipe(
      switchMap(() => getDownloadURL(fileRef))
    );
  }
}
