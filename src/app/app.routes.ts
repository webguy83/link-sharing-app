import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'create-account',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'link-sharing-dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./link-sharing-dashboard/link-sharing-dashboard.routes').then(m => m.LinkSharingDashboardRoutes),
  },
];
