export class UpdateDebtDto {
    private constructor(
      public id: string,
      public description?: string,
      public amount?: number,
      public dueDate?: Date,
    ) {}
  
    static create(object: { [key: string]: any }): [string?, UpdateDebtDto?] {
      const { id, description, amount, dueDate } = object;
  
      if (!id) return ['El id es obligatorio'];
      
      if (amount !== undefined) {
        if (isNaN(Number(amount))) return ['El monto debe ser un número válido'];
        if (amount < 0) return ['El monto no puede ser negativo'];
      }
  
      return [undefined, new UpdateDebtDto(id, description, amount, dueDate)];
    }
  }