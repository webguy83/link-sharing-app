import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LinkSharingDashboardComponent } from './link-sharing-dashboard/link-sharing-dashboard.component';
import { LinksComponent } from './links/links.component';
import { canDeactivateUnsavedChanges } from './guards/can-deactivate.guard';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'create-account', component: LoginComponent },
  {
    path: 'link-sharing-dashboard',
    component: LinkSharingDashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'links', pathMatch: 'full' },
      {
        path: 'links',
        component: LinksComponent,
        canDeactivate: [canDeactivateUnsavedChanges],
      },
      {
        path: 'profile-details',
        component: ProfileDetailsComponent,
        canDeactivate: [canDeactivateUnsavedChanges],
      },
    ],
  },
];
