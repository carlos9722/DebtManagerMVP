import { Router } from 'express';
import { DebtorController } from './controller';
import { DebtorService } from '../services';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DebtorRoutes {

  static get routes(): Router {
    const router = Router();
    const debtorService = new DebtorService();
    const controller = new DebtorController(debtorService);

    router.use(AuthMiddleware.validateJWT);

    router.post('/create', controller.createDebtor);
    router.get('/list', controller.getDebtors);
    router.get('/listById/:id', controller.getDebtorById);
    router.put('/update/:id', controller.updateDebtor);
    router.delete('/delete/:id', controller.deleteDebtor);

    return router;
  }
}