// profile-and-links.resolver.ts
import { ResolveFn } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { FirebaseData } from '../shared/models/basics.model';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const profileAndLinksResolver: ResolveFn<FirebaseData | null> = (
  route,
  _state
) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate(['']);
    return of(null);
  }

  return forkJoin({
    profile: userService.getUserProfile(id),
    links: userService.getUserLinks(id),
  });
};
