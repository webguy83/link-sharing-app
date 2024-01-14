import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

export const validIdGuard: CanActivateFn = (route, state) => {
  // Temporary: Always return true for validation
  return of(true);
};
