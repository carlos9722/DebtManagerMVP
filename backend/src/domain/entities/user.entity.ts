import { CustomError } from '../errors/custom.error';

export class UserEntity {

  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: boolean,
    public password: string,
  ) {}

  static fromObject(object: { [key: string]: any }): UserEntity {
    const { id, name, email, emailValidated, password } = object;

    if (!id) throw CustomError.badRequest('El id es obligatorio');
    if (!name) throw CustomError.badRequest('El nombre es requerido');
    if (!email) throw CustomError.badRequest('El correo electrónico es requerido');
    if (emailValidated === undefined) throw CustomError.badRequest('La validación del correo es requerida');
    if (!password) throw CustomError.badRequest('La contraseña es requerida');


    return new UserEntity(id, name, email, emailValidated, password);
  }

}