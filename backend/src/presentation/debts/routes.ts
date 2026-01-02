import { Router } from 'express';
import { DebtController } from './controller';
import { DebtService } from '../services/debt.service';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class DebtRoutes {

  static get routes(): Router {
    const router = Router();
    const debtService = new DebtService();
    const controller = new DebtController(debtService);

    router.use(AuthMiddleware.validateJWT);

    // Rutas específicas
    router.get('/statistics', controller.getAggregations);
    router.get('/export', controller.exportDebts);
    router.get('/debtor/:debtorId', controller.getDebtsByDebtor);

    // Rutas Debts necesarias
    router.post('/create', controller.createDebt);
    router.get('/listById/:id', controller.getDebtById);
    router.put('/update/:id', controller.updateDebtById);
    router.patch('/pay/:id', controller.markAsPaidDebtById);
    router.delete('/delete/:id', controller.deleteDebtById);

    return router;
  }
}