// profile-and-links.resolver.ts
import { ResolveFn } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Profile, LinkBlock } from '../shared/models/basics.model';
import { Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

export const profileAndLinksResolver: ResolveFn<{
  userProfile: Profile;
  userLinks: LinkBlock[];
}> = (_route, _state) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  return authService.user$.pipe(
    switchMap((user) => {
      if (!user) {
        router.navigate(['']);
        return of({ userProfile: {} as Profile, userLinks: [] });
      }

      return forkJoin({
        userProfile: userService.getUserProfile(user.uid),
        userLinks: userService.getUserLinks(user.uid),
      });
    }),
    catchError(() => {
      router.navigate(['']);
      return of({ userProfile: {} as Profile, userLinks: [] });
    })
  );
};
