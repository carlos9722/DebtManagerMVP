import { regularExps } from "../../../config";

export class CreateDebtorDto {
    private constructor(
      public name: string,
      public email?: string,
      public phone?: string,
      public notes?: string,
    ) {}
  
    static create(object: { [key: string]: any }): [string?, CreateDebtorDto?] {
      const { name, email, phone, notes } = object;
  
      if (!name) return ['El nombre es obligatorio'];
      if (name.length < 2) return ['El nombre debe tener al menos 2 caracteres'];
      if (email && !regularExps.email.test(email)) return ['El correo electrónico no es válido'];
      if (phone && !regularExps.phone.test(phone)) return ['El teléfono no es válido'];

      return [undefined, new CreateDebtorDto(name, email, phone, notes)];
    }
  }