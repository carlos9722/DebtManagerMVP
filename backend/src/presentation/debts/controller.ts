import { Request, Response } from 'express';
import { CreateDebtDto, UpdateDebtDto, CustomError } from '../../domain';
import { DebtService } from '../services';

export class DebtController {

  //DI
  constructor(
    private readonly debtService: DebtService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(`${error}`);
    return res.status(500).json({ error: 'Internal server error' });
  };

  createDebt = (req: Request, res: Response) => {
    const [error, createDebtDto] = CreateDebtDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.debtService.createDebt(createDebtDto!)
      .then(debt => res.status(201).json(debt))
      .catch(error => this.handleError(error, res));
  };
  
  getDebtById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.debtService.getDebtById(id)
      .then(debt => res.json(debt))
      .catch(error => this.handleError(error, res));
  };

  getDebtsByDebtor = (req: Request, res: Response) => {
    const { debtorId } = req.params;

    this.debtService.getDebtsByDebtorId(debtorId)
      .then(result => res.json(result))
      .catch(error => this.handleError(error, res));
  };

  updateDebtById = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateDebtDto] = UpdateDebtDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    this.debtService.updateDebt(updateDebtDto!)
      .then(debt => res.json(debt))
      .catch(error => this.handleError(error, res));
  };

  markAsPaidDebtById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.debtService.markAsPaidDebtById(id)
      .then(debt => res.json(debt))
      .catch(error => this.handleError(error, res));
  };

  deleteDebtById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.debtService.deleteDebtById(id)
      .then(result => res.json(result))
      .catch(error => this.handleError(error, res));
  };

  // Endpoint de agregaciones
  getAggregations = (req: Request, res: Response) => {
    this.debtService.getAggregations()
      .then(result => res.json(result))
      .catch(error => this.handleError(error, res));
  };

  // Endpoint de exportación
  exportDebts = (req: Request, res: Response) => {
    const format = (req.query.format as string) || 'json';
    const status = req.query.status as 'all' | 'pending' | 'paid' | undefined;

    if (format !== 'json' && format !== 'csv') {
      return res.status(400).json({ error: 'Formato no válido. Use json o csv' });
    }

    this.debtService.exportDebts(format, status)
      .then(result => {
        if (format === 'csv') {
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=deudas.csv');
          return res.send(result.data);
        }
        return res.json(result);
      })
      .catch(error => this.handleError(error, res));
  };
}