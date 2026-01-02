import { User } from "../../data/postgres/entities";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { bcryptAdapter, jwtAdapter, envs } from "../../config";
import { EmailService } from "./email.service";


// Servicio de autenticación
export class AuthService {

    //DI
    constructor(
        private readonly emailService: EmailService,
    ){}

    // Registrar un usuario
    public async registerUser(registerUserDto: RegisterUserDto ) {
        const existUser = await User.findOne({ where: { email: registerUserDto.email } });
        if ( existUser ) throw CustomError.badRequest('El correo electrónico ya está registrado');

        try{
            const user = User.create({
                name: registerUserDto.name,
                email: registerUserDto.email,
                password: bcryptAdapter.hash(registerUserDto.password),
            });

            await user.save();

            await this.sendEmailValidationLink( user.email );

            const {password, ...userEntity } = UserEntity.fromObject(user);

            const token = await jwtAdapter.generateToken({ id: user.id });
            if ( !token ) throw CustomError.internalServer('Error en la creación del JWT');

            return {
                user: userEntity,
                token: token,
            };

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }
    }

    // Iniciar sesión
    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await User.findOne({ where: { email: loginUserDto.email } });
        if (!user) throw CustomError.badRequest('Email no existe');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isMatching) throw CustomError.badRequest('Contraseña incorrecta');

        if (!user.emailValidated) throw CustomError.unauthorized('El email no está validado');

        const {password, ...userEntity } = UserEntity.fromObject(user);

        const token = await jwtAdapter.generateToken({ id: user.id });
        if ( !token ) throw CustomError.internalServer('Error en la creación del JWT');

        return {
            user: userEntity,
            token: token,
        };
    }

    // Validar email
    public async validateEmail(token: string) {
        const payload = await jwtAdapter.validateToken(token);
        if ( !payload ) throw CustomError.unauthorized('Token inválido');

        const { email } = payload as { email: string };
        if ( !email ) throw CustomError.internalServer('Email no encontrado en el token');

        const user = await User.findOne({ where: { email  } });
        if ( !user ) throw CustomError.internalServer('Usuario no encontrado');

        user.emailValidated = true;
        await user.save();
        
        return true;
    }
    

    // Enviar enlace de validación de email
    private sendEmailValidationLink = async( email: string ) => {

        const token = await jwtAdapter.generateToken({ email });
        if ( !token ) throw CustomError.internalServer('Error en la creación del JWT');
    
        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
          <h1>Validar tu email</h1>
          <p>Haz click en el siguiente enlace para validar tu email</p>
          <a href="${ link }">Validar tu email: ${ email }</a>
        `;
    
        const options = {
          to: email,
          subject: 'Validar tu email',
          htmlBody: html,
        }
    
        const isSent = await this.emailService.sendEmail(options);
        console.log('isSent', isSent);
        if ( !isSent ) throw CustomError.internalServer('Error al enviar el email');
    
        return true;
      }
}