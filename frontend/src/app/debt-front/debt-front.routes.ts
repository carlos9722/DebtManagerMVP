import { Routes } from '@angular/router';
import { DebtFrontLayoutComponent } from './layouts/debt-front-layout/debt-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const debtFrontRoutes: Routes = [
  {
    path: '',
    component: DebtFrontLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'not-found',
        component: NotFoundPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

export default debtFrontRoutes;
