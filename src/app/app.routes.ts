import { Routes } from '@angular/router';
import { checkIdGuard } from './guards/checkId.guard';
import { AuthGuard } from './guards/auth.guard';
import { authResolver } from './resolvers/auth.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard.canActivate],
    resolve: { isAuthenticated: authResolver },
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'link-sharing-dashboard',
    loadChildren: () =>
      import('./link-sharing-dashboard/link-sharing-dashboard.routes').then(
        (m) => m.LinkSharingDashboardRoutes
      ),
  },
  {
    path: 'preview/:id',
    loadComponent: () =>
      import('./preview/preview.component').then((m) => m.PreviewComponent),
    canActivate: [checkIdGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
