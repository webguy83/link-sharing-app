import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LinkBlock, Profile } from '../shared/models/basics.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  createUserProfile(userId: string, profile: Profile) {
    const profileDocRef = doc(
      collection(this.firestore, 'users', userId, 'profile'),
      'profileData'
    );
    return from(setDoc(profileDocRef, profile));
  }

  createUserLinks(userId: string, links: LinkBlock[]): Observable<void> {
    const linksCollectionRef = collection(
      this.firestore,
      `users/${userId}/links`
    );

    return from(getDocs(linksCollectionRef)).pipe(
      switchMap((querySnapshot) => {
        const batch = writeBatch(this.firestore);

        // Delete existing documents
        querySnapshot.forEach((docSnapshot) => {
          batch.delete(docSnapshot.ref);
        });

        // Add new links
        links.forEach((link) => {
          const newDocRef = doc(linksCollectionRef);
          batch.set(newDocRef, link);
        });

        // Commit the batch
        return from(batch.commit());
      }),
      map(() => void 0),
      catchError((err) => {
        console.error('Error updating user links:', err);
        return of(void 0);
      })
    );
  }

  uploadProfilePicture(userId: string, file: File) {
    const filePath = `profilePictures/${userId}/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    return from(uploadBytes(fileRef, file)).pipe(
      switchMap(() => getDownloadURL(fileRef))
    );
  }
}
