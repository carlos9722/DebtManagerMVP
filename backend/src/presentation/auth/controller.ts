import { Request, Response } from 'express';
import { LoginUserDto, RegisterUserDto, CustomError } from '../../domain';
import { AuthService } from '../services';

export class AuthController {
    
    //DI
    constructor(
        public readonly authService: AuthService,
    ){}

    //* Handle errors
    private handleError = (error: unknown, res: Response) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({error: error.message});
        }
        console.error(`${ error }`);
        return res.status(500).json({error: 'Error interno del servidor'});
    }

    // Registrar un usuario
    registerUser = (req: Request, res: Response) => {  
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if ( error ) return res.status(400).json({error})

        this.authService.registerUser(registerUserDto!)
         .then( user => res.status(201).json(user) )
         .catch( error => this.handleError(error, res) );
    }

    // Iniciar sesión
    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if ( error ) return res.status(400).json({error})
        
        this.authService.loginUser(loginUserDto!)
         .then( user => res.status(200).json(user) )
         .catch( error => this.handleError(error, res) );
    }

    // Validar email
    validateEmailUser = (req: Request, res: Response) => {
        const { token } = req.params;

        this.authService.validateEmail(token)
         .then( () => res.status(200).json({message: 'Email validado correctamente'}) )
         .catch( error => this.handleError(error, res) );
    }

}