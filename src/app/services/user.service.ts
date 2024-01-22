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
  deleteObject,
  listAll,
  StorageReference,
} from '@angular/fire/storage';
import { EMPTY, from, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { LinkBlock, Profile } from '../shared/models/basics.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  createUserProfile(userId: string, profile: Profile): Observable<void> {
    const firebaseProfile = {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    };
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(
      setDoc(userDocRef, { profile: firebaseProfile }, { merge: true })
    );
  }

  createUserLinks(userId: string, links: LinkBlock[]): Observable<void> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    if (links.length === 0) {
      // If the links array is empty, remove the 'links' field from the document
      return from(updateDoc(userDocRef, { links: deleteField() }));
    }
    return from(setDoc(userDocRef, { links }, { merge: true }));
  }

  private deleteExistingImages(userId: string): Observable<void> {
    const storageRef = ref(this.storage, `profilePictures/${userId}/`);
    return from(listAll(storageRef)).pipe(
      switchMap((res) => {
        const deletionPromises = res.items.map((item) => deleteObject(item));
        return from(Promise.all(deletionPromises)).pipe(
          switchMap(() => of(undefined))
        );
      })
    );
  }

  private uploadNewImage(userId: string, file: File): Observable<string> {
    const filePath = `profilePictures/${userId}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    return from(uploadBytes(fileRef, file)).pipe(
      switchMap(() => getDownloadURL(fileRef))
    );
  }

  uploadProfilePicture(
    userId: string,
    file: File | null
  ): Observable<string | void> {
    return this.deleteExistingImages(userId).pipe(
      switchMap(() => {
        if (file) {
          return this.uploadNewImage(userId, file);
        }
        return EMPTY;
      })
    );
  }
}
