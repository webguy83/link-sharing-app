import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { profileAndLinksResolver } from './resolvers/profile-and-links.resolver.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthGuard.canActivate],
  },
  {
    path: 'create-account',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'link-sharing-dashboard/:id',
    loadComponent: () =>
      import('./link-sharing-dashboard/link-sharing-dashboard.component').then(
        (m) => m.LinkSharingDashboardComponent
      ),
    canActivate: [AuthGuard.canActivate],
    resolve: { backendData: profileAndLinksResolver },
  },
  {
    path: 'preview/:id',
    loadComponent: () =>
      import('./preview/preview.component').then((m) => m.PreviewComponent),
    resolve: { backendData: profileAndLinksResolver },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
