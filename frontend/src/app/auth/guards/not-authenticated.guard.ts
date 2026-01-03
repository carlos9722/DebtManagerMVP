import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';


export const NotAuthenticatedGuard: CanMatchFn = async (
  _route: Route,
  segments: UrlSegment[]
) => {

  const authService = inject(AuthService);

  const router = inject(Router);

  const path = segments.map(s => s.path).join('/');
  if (path.includes('validate-email')) {
    return true;
  }

  const isAuthenticated = authService.authStatus() === 'authenticated';

  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
