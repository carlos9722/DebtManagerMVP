import { Request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthService } from '../services';

export class AuthController {
    
    //DI
    constructor(
        public readonly authService: AuthService,
    ){}

    private handleError = (error: unknown, res: Response) => {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({error: error.message});
        }
        console.log(`${ error }`);
        return res.status(500).json({error: 'Error interno del servidor'});
    }

    registerUser = (req: Request, res: Response) => {  
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if ( error ) return res.status(400).json({error})

        this.authService.registerUser(registerUserDto!)
         .then( user => res.status(201).json(user) )
         .catch( error => this.handleError(error, res) );
    }

    loginUser = (req: Request, res: Response) => {
        res.json({ message: 'Login User ' });
    }

    validateEmailUser = (req: Request, res: Response) => {
        res.json({ message: 'Validate email ' });
    }

}