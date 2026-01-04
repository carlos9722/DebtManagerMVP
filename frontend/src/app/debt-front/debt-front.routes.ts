import { Routes } from '@angular/router';
import { DebtFrontLayoutComponent } from './layouts/debt-front-layout/debt-front-layout.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { DebtorsPageComponent } from './pages/debtors-page/debtors-page.component';
import { DebtorDebtsPageComponent } from './pages/debtor-debts-page/debtor-debts-page.component';

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
        path: 'debtors/:debtorId/debts',
        component: DebtorDebtsPageComponent,
      },
      {
        path: 'debtors',
        component: DebtorsPageComponent,
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
