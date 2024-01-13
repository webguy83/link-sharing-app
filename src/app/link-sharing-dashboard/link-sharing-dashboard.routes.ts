import { Routes } from '@angular/router';
import { canDeactivateUnsavedChanges } from '../guards/can-deactivate.guard';

export const LinkSharingDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../link-sharing-dashboard/link-sharing-dashboard.component').then(
        (m) => m.LinkSharingDashboardComponent
      ),
    children: [
      { path: '', redirectTo: 'links', pathMatch: 'full' },
      {
        path: 'links',
        loadComponent: () =>
          import('../links/links.component').then((m) => m.LinksComponent),
        canDeactivate: [canDeactivateUnsavedChanges],
      },
      {
        path: 'profile-details',
        loadComponent: () =>
          import('../profile-details/profile-details.component').then(
            (m) => m.ProfileDetailsComponent
          ),
        canDeactivate: [canDeactivateUnsavedChanges],
      },
    ],
  },
];
