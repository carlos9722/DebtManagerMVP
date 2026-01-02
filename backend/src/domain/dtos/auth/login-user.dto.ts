import { regularExps } from "../../../config";


export class LoginUserDto {

  private constructor(
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    
    if (!object || typeof object !== 'object') {
      return ['El cuerpo de la solicitud no es válido'];
    }

    const { email, password } = object;

    if (!email) return ['El correo electrónico es requerido'];
    if (!regularExps.email.test(email)) return ['El correo electrónico no es válido'];
    if (!password) return ['La contraseña es requerida'];
    if (password.length < 6) return ['La contraseña debe tener al menos 6 caracteres'];

    return [undefined, new LoginUserDto(email, password)];
  }

}