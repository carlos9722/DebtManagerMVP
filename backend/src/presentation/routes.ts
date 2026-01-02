import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { DebtorRoutes } from './debtors/routes';
import { DebtRoutes } from './debts/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/debtors', DebtorRoutes.routes);
    router.use('/api/debts', DebtRoutes.routes);



    return router;
  }


}
