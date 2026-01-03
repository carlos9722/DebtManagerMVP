import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';


export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {

  const authService = inject(AuthService);

  const router = inject(Router);

  const isAuthenticated = authService.authStatus() === 'authenticated';

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
