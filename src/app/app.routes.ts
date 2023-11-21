import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';
import { LinkSharingDashboardComponent } from './link-sharing-dashboard/link-sharing-dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'create-account', component: LoginComponent },
  {
    path: 'link-sharing-dashboard',
    component: LinkSharingDashboardComponent,
    canActivate: [authGuard],
  },
];
