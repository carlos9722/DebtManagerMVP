import { Debtor } from "../../data/postgres/entities";
import { CreateDebtorDto, UpdateDebtorDto, CustomError } from '../../domain';

export class DebtorService {

  public async createDebtor(createDebtorDto: CreateDebtorDto) {
    try {
      const debtor = Debtor.create({
        name: createDebtorDto.name,
        email: createDebtorDto.email,
        phone: createDebtorDto.phone,
        notes: createDebtorDto.notes,
      });

      await debtor.save();
      return debtor;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getDebtors() {
    try {
      const debtors = await Debtor.find({
        order: { createdAt: 'DESC' },
      });
      return debtors;

    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getDebtorById(id: string) {
    try {
      const debtor = await Debtor.findOne({
        where: { id },
        relations: ['debts']
      });

      if (!debtor) {
        throw CustomError.notFound('Deudor no encontrado');
      }

      return debtor;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async updateDebtor(updateDebtorDto: UpdateDebtorDto) {
    const { id, ...updateData } = updateDebtorDto;

    try {
      const debtor = await this.getDebtorById(id);

      if (updateData.name !== undefined) debtor.name = updateData.name;
      if (updateData.email !== undefined) debtor.email = updateData.email;
      if (updateData.phone !== undefined) debtor.phone = updateData.phone;
      if (updateData.notes !== undefined) debtor.notes = updateData.notes;

      await debtor.save();
      return debtor;

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async deleteDebtor(id: string) {
    try {
      const debtor = await this.getDebtorById(id);
      await debtor.remove();
      return { message: 'Deudor eliminado correctamente' };

    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw CustomError.internalServer(`${error}`);
    }
  }
}