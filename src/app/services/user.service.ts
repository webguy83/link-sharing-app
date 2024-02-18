import { inject, Injectable } from '@angular/core';
import {
  DocumentData,
  Firestore,
  deleteField,
  doc,
  getDoc,
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
  getBlob,
} from '@angular/fire/storage';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  FirebaseData,
  LinkBlock,
  Profile,
} from '../shared/models/basics.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  private fetchUserProfileData(userId: string): Observable<FirebaseData> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userDocRef)).pipe(
      map((docSnapshot) => {
        if (!docSnapshot.exists()) {
          return {
            profile: { firstName: '', lastName: '', email: '' },
            links: [],
          };
        }
        return docSnapshot.data();
      }),
      switchMap((data) => {
        return this.combineDataWithProfilePic(userId, data);
      })
    );
  }

  private combineDataWithProfilePic(
    userId: string,
    data: DocumentData
  ): Observable<FirebaseData> {
    const profilePicRef = ref(this.storage, `profilePictures/${userId}`);
    return from(listAll(profilePicRef)).pipe(
      switchMap((res) => {
        if (res.items.length > 0) {
          return getBlob(res.items[0]);
        }
        return of(null);
      }),
      map((blob) => {
        let picture = null;
        if (blob) {
          picture = new File([blob], 'profileImg', { type: blob.type });
        }
        const outputData: FirebaseData = {
          profile: {
            firstName: data['profile'].firstName,
            lastName: data['profile'].lastName,
            email: data['profile'].email,
            picture,
          },
          links: data['links'],
        };
        return outputData;
      })
    );
  }

  getUserProfile(userId: string): Observable<Profile> {
    return this.fetchUserProfileData(userId).pipe(
      map((data: FirebaseData) => {
        const profileData = data.profile || {};
        return {
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          picture: profileData.picture, // Handle picture separately as needed
        };
      })
    );
  }

  getUserLinks(userId: string): Observable<LinkBlock[]> {
    return this.fetchUserProfileData(userId).pipe(
      map((data: FirebaseData) => data.links || [])
    );
  }

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
  ): Observable<string | null> {
    return this.deleteExistingImages(userId).pipe(
      switchMap(() => {
        if (file) {
          return this.uploadNewImage(userId, file);
        }
        return of(null);
      })
    );
  }
}
