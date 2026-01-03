import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';
import { AuthenticatedGuard } from '@auth/guards/authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.authRoutes),
    canMatch: [
      NotAuthenticatedGuard,
    ],
  },
  {
    path: 'debt',
    loadChildren: () =>
      import('./debt-front/debt-front.routes').then(m => m.debtFrontRoutes),
    canMatch: [
      AuthenticatedGuard,
    ],
  },
  {
    path: '',
    redirectTo: 'debt',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'debt',
  },
];
