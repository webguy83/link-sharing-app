// profile-and-links.resolver.ts
import { ResolveFn } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { Profile, FirebaseData } from '../shared/models/basics.model';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const profileAndLinksResolver: ResolveFn<FirebaseData> = (
  route,
  _state
) => {
  const userService = inject(UserService);
  const router = inject(Router);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate(['']);
    return of<FirebaseData>({ profile: {} as Profile, links: [] });
  }

  return forkJoin({
    profile: userService.getUserProfile(id),
    links: userService.getUserLinks(id),
  });
};
