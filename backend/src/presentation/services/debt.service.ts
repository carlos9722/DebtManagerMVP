import { Debt, Debtor } from '../../data/postgres/entities';
import { CreateDebtDto, UpdateDebtDto } from '../../domain';
import { CustomError } from '../../domain/errors/custom.error';
import { cacheAdapter } from '../../config';

export class DebtService {

  private readonly CACHE_TTL = 300; // 5 minutos

  private getCacheKey(type: string, id?: string): string {
    return id ? `debts:${type}:${id}` : `debts:${type}`;
  }

  private async invalidateCache(): Promise<void> {
    await cacheAdapter.delByPattern('debts:*');
  }

  public async createDebt(createDebtDto: CreateDebtDto) {
    const { debtorId, description, amount, dueDate } = createDebtDto;

    try {
      const debtor = await Debtor.findOneBy({ id: debtorId });

      if (!debtor) {
        throw CustomError.notFound('Deudor no encontrado');
      }

      const debt = Debt.create({
        description,
        amount,
        debtorId,
        dueDate,
      });

      await debt.save();
      
      // Invalidar caché después de crear
      await this.invalidateCache();
      
      return debt;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getDebtById(id: string) {
    try {
      const cacheKey = this.getCacheKey('detail', id);
      
      // Intentar obtener de caché
      const cached = await cacheAdapter.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const debt = await Debt.findOne({
        where: { id },
        relations: ['debtor'],
      });

      if (!debt) {
        throw CustomError.notFound('Deuda no encontrada');
      }

      // Guardar en caché
      await cacheAdapter.set(cacheKey, JSON.stringify(debt), this.CACHE_TTL);

      return debt;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async updateDebt(updateDebtDto: UpdateDebtDto) {
    const { id, description, amount, dueDate } = updateDebtDto;

    try {
      // Obtener directamente de BD para asegurar datos frescos
      const debt = await Debt.findOne({
        where: { id },
        relations: ['debtor'],
      });

      if (!debt) {
        throw CustomError.notFound('Deuda no encontrada');
      }

      if (debt.isPaid) {
        throw CustomError.badRequest('No se puede modificar una deuda ya pagada');
      }

      if (description !== undefined) debt.description = description;
      if (amount !== undefined) debt.amount = amount;
      if (dueDate !== undefined) debt.dueDate = dueDate;

      await debt.save();
      
      // Invalidar caché
      await this.invalidateCache();
      
      return debt;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async markAsPaidDebtById(id: string) {
    try {
      const debt = await Debt.findOne({
        where: { id },
        relations: ['debtor'],
      });

      if (!debt) {
        throw CustomError.notFound('Deuda no encontrada');
      }

      if (debt.isPaid) {
        throw CustomError.badRequest('Deuda ya pagada');
      }

      debt.isPaid = true;
      debt.paidAt = new Date();

      await debt.save();
      
      // Invalidar caché
      await this.invalidateCache();
      
      return debt;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async deleteDebtById(id: string) {
    try {
      const debt = await Debt.findOne({
        where: { id },
        relations: ['debtor'],
      });

      if (!debt) {
        throw CustomError.notFound('Deuda no encontrada');
      }

      await debt.remove();
      
      // Invalidar caché
      await this.invalidateCache();
      
      return { message: 'Deuda eliminada correctamente' };

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getDebtsByDebtorId(debtorId: string) {
    try {
      const cacheKey = this.getCacheKey('debtor', debtorId);
      
      // Intentar obtener de caché
      const cached = await cacheAdapter.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const debtor = await Debtor.findOneBy({ id: debtorId });
      
      if (!debtor) {
        throw CustomError.notFound('Deudor no encontrado');
      }

      const debts = await Debt.find({
        where: { debtorId },
        order: { createdAt: 'DESC' },
      });

      const pending = debts.filter(d => !d.isPaid);
      const paid = debts.filter(d => d.isPaid);

      const result = {
        debtor,
        pending,
        paid,
        summary: {
          totalDebts: debts.length,
          pendingCount: pending.length,
          paidCount: paid.length,
          totalAmount: debts.reduce((sum, d) => sum + Number(d.amount), 0),
          pendingAmount: pending.reduce((sum, d) => sum + Number(d.amount), 0),
          paidAmount: paid.reduce((sum, d) => sum + Number(d.amount), 0),
        }
      };

      // Guardar en caché
      await cacheAdapter.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);

      return result;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  // Método para agregaciones
  public async getAggregations() {
    try {
      const cacheKey = this.getCacheKey('aggregations');
      
      const cached = await cacheAdapter.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const allDebts = await Debt.find();
      
      const pending = allDebts.filter(d => !d.isPaid);
      const paid = allDebts.filter(d => d.isPaid);

      const result = {
        totalDebts: allDebts.length,
        pendingDebts: pending.length,
        paidDebts: paid.length,
        totalAmount: allDebts.reduce((sum, d) => sum + Number(d.amount), 0),
        pendingAmount: pending.reduce((sum, d) => sum + Number(d.amount), 0),
        paidAmount: paid.reduce((sum, d) => sum + Number(d.amount), 0),
      };

      await cacheAdapter.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);

      return result;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  // Método para exportar deudas
  public async exportDebts(format: 'json' | 'csv', status?: 'all' | 'pending' | 'paid') {
    try {
      const filters: { isPaid?: boolean } = {};
      
      if (status === 'pending') filters.isPaid = false;
      if (status === 'paid') filters.isPaid = true;

      const debts = await Debt.find({
        where: Object.keys(filters).length > 0 ? filters : undefined,
        relations: ['debtor'],
        order: { createdAt: 'DESC' },
      });

      if (format === 'json') {
        return {
          format: 'json',
          data: debts,
          count: debts.length,
          exportedAt: new Date().toISOString(),
        };
      }

      // Formato CSV
      const headers = ['ID', 'Descripción', 'Monto', 'Pagada', 'Fecha Vencimiento', 'Fecha Pago', 'Deudor', 'Creada'];
      const rows = debts.map(d => [
        d.id,
        `"${d.description.replace(/"/g, '""')}"`,
        d.amount,
        d.isPaid ? 'Sí' : 'No',
        d.dueDate ? new Date(d.dueDate).toLocaleDateString() : '',
        d.paidAt ? new Date(d.paidAt).toLocaleDateString() : '',
        `"${d.debtor?.name || ''}"`,
        new Date(d.createdAt).toLocaleDateString(),
      ]);

      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

      return {
        format: 'csv',
        data: csv,
        count: debts.length,
        exportedAt: new Date().toISOString(),
      };

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }
}