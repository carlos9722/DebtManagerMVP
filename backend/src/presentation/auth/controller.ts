import { Request, Response } from 'express';

export class AuthController {
    
    //DI
    constructor(){}

    registerUser = (req: Request, res: Response) => {  
        res.json({ message: 'Register User ' });
    }

    loginUser = (req: Request, res: Response) => {
        res.json({ message: 'Login User ' });
    }

    validateEmailUser = (req: Request, res: Response) => {
        res.json({ message: 'Validate email ' });
    }

}