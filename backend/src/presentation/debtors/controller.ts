import { Request, Response } from 'express';
import { CreateDebtorDto, UpdateDebtorDto, CustomError } from '../../domain';
import { DebtorService } from '../services';


export class DebtorController {

  //DI
  constructor(
    private readonly debtorService: DebtorService,
  ) {}

  //* Handle errors
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error(`${error}`);
    return res.status(500).json({ error: 'Error interno del servidor' });
  };

  //* Crea deudor
  createDebtor = (req: Request, res: Response) => {
    const [error, createDebtorDto] = CreateDebtorDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.debtorService.createDebtor(createDebtorDto!)
      .then(debtor => res.status(201).json(debtor))
      .catch(error => this.handleError(error, res));
  };

  //* listar deudores
  getDebtors = (req: Request, res: Response) => {
    this.debtorService.getDebtors()
      .then(debtors => res.json(debtors))
      .catch(error => this.handleError(error, res));
  };

  //* obtener deudor por id
  getDebtorById = (req: Request, res: Response) => {
    const { id } = req.params;

    this.debtorService.getDebtorById(id)
      .then(debtor => res.json(debtor))
      .catch(error => this.handleError(error, res));
  };

  //* actualizar deudor
  updateDebtor = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateDebtorDto] = UpdateDebtorDto.create({ ...req.body, id });
    if (error) return res.status(400).json({ error });

    this.debtorService.updateDebtor(updateDebtorDto!)
      .then(debtor => res.json(debtor))
      .catch(error => this.handleError(error, res));
  };

  //* eliminar deudor
  deleteDebtor = (req: Request, res: Response) => {
    const { id } = req.params;

    this.debtorService.deleteDebtor(id)
      .then(result => res.json(result))
      .catch(error => this.handleError(error, res));
  };
}