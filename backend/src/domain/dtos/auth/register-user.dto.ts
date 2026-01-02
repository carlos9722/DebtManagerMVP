import { regularExps } from '../../../config';


export class RegisterUserDto {

  private constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ['El nombre es requerido'];
    if (!email) return ['El correo electrónico es requerido'];
    if (!regularExps.email.test(email)) return ['El correo electrónico no es válido'];
    if (!password) return ['La contraseña es requerida'];
    if (password.length < 6) return ['La contraseña debe tener al menos 6 caracteres'];

    return [undefined, new RegisterUserDto(name, email, password)];
  }

}