import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { DebtorRoutes } from './debtors/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes );
    router.use('/api/debtors', DebtorRoutes.routes);



    return router;
  }


}
