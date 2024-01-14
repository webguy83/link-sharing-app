import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { authResolver } from './resolvers/auth.resolver';
import { validIdGuard } from './guards/validId.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    resolve: { isAuthenticated: authResolver },
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'link-sharing-dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./link-sharing-dashboard/link-sharing-dashboard.routes').then(
        (m) => m.LinkSharingDashboardRoutes
      ),
  },
  {
    path: 'preview/:id',
    loadComponent: () =>
      import('./preview/preview.component').then((m) => m.PreviewComponent),
    canActivate: [validIdGuard],
  },
];
