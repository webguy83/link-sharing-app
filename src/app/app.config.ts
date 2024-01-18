import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'frontendmentor-linksharing',
          appId: '1:866961465957:web:7d507304c8b3aac0fcdc8c',
          storageBucket: 'frontendmentor-linksharing.appspot.com',
          apiKey: 'AIzaSyD1_wziAIKitnv0Q7284b5kU6zixOgUxvs',
          authDomain: 'frontendmentor-linksharing.firebaseapp.com',
          messagingSenderId: '866961465957',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
    importProvidersFrom(provideStorage(() => getStorage())),
  ],
};
