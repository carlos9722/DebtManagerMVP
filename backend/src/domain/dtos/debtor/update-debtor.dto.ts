import { regularExps } from '../../../config';

export class UpdateDebtorDto {
    private constructor(
      public id: string,
      public name?: string,
      public email?: string,
      public phone?: string,
      public notes?: string,
    ) {}
  
    static create(object: { [key: string]: any }): [string?, UpdateDebtorDto?] {
      const { id, name, email, phone, notes } = object;
  
      if (!id) return ['El id es obligatorio'];
      if (name && name.length < 2) return ['El nombre debe tener al menos 2 caracteres'];
      if (!regularExps.email.test(email)) return ['El correo electrónico no es válido'];
      if (!regularExps.phone.test(phone)) return ['El teléfono no es válido'];
  
      return [undefined, new UpdateDebtorDto(id, name, email, phone, notes)];
    }
  }