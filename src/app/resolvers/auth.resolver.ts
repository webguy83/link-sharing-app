import {
  ResolveFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { tap, take, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authResolver: ResolveFn<boolean> = (
  _route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isAuthenticated().pipe(
    take(1),
    tap((isAuth) => {
      if (isAuth) {
        router.navigate(['/link-sharing-dashboard']);
      }
    }),
    map((isAuth) => !isAuth)
  );
};
