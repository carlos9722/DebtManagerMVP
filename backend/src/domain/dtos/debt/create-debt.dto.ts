export class CreateDebtDto {
    private constructor(
      public description: string,
      public amount: number,
      public debtorId: string,
      public dueDate?: Date,
    ) {}
  
    static create(object: { [key: string]: any }): [string?, CreateDebtDto?] {
      const { description, amount, debtorId, dueDate } = object;
  
      if (!description) return ['La descripción es obligatoria'];
      if (amount === undefined || amount === null) return ['El monto es obligatorio'];
      if (isNaN(Number(amount))) return ['El monto debe ser un número válido'];
      if (amount < 0) return ['El monto no puede ser negativo'];
      if (!debtorId) return ['El id del deudor es obligatorio'];
  
      return [undefined, new CreateDebtDto(description, amount, debtorId, dueDate)];
    }
  }