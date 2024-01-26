import { Routes } from '@angular/router';
import { checkIdGuard } from './guards/checkId.guard';
import { AuthGuard } from './guards/auth.guard';
import { profileAndLinksResolver } from './resolvers/profile-and-links.resolver.resolver';
import { canDeactivateUnsavedChanges } from './guards/can-deactivate.guard';

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
    path: 'link-sharing-dashboard',
    loadComponent: () =>
      import('./link-sharing-dashboard/link-sharing-dashboard.component').then(
        (m) => m.LinkSharingDashboardComponent
      ),
      canActivate: [AuthGuard.canActivate],
      canActivateChild: [AuthGuard.canActivate],
      children: [
        { path: '', redirectTo: 'links', pathMatch: 'full' },
        {
          path: 'links',
          loadComponent: () =>
            import('./links/links.component').then((m) => m.LinksComponent),
          canDeactivate: [canDeactivateUnsavedChanges],
        },
        {
          path: 'profile-details',
          loadComponent: () =>
            import('./profile-details/profile-details.component').then(
              (m) => m.ProfileDetailsComponent
            ),
          canDeactivate: [canDeactivateUnsavedChanges],
        },
      ],
    resolve: { profileAndLinks: profileAndLinksResolver },
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
