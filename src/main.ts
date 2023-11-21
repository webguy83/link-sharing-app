import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './app/environments/environment';
import { initializeApp } from 'firebase/app';

initializeApp(environment.firebaseConfig);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
