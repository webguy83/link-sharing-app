// auth.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export class AuthGuard {
  static canActivate: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (state.url === '' && isAuthenticated) {
          // Redirect authenticated users trying to access base route to dashboard
          return router.createUrlTree(['/link-sharing-dashboard']);
        } else if (
          state.url.startsWith('/link-sharing-dashboard') &&
          !isAuthenticated
        ) {
          // Redirect unauthenticated users trying to access dashboard to base route
          return router.createUrlTree(['']);
        }
        // Allow the route
        return true;
      })
    );
  };
}
