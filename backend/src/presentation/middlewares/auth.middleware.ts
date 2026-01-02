import { NextFunction, Request, Response } from 'express';
import { jwtAdapter } from '../../config';
import { User } from '../../data/postgres/entities';
import { UserEntity } from '../../domain';

export class AuthMiddleware {

  static async validateJWT(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header('Authorization');
    
    if (!authorization) return res.status(401).json({ error: 'Token no proporcionado' });
    if (!authorization.startsWith('Bearer ')) return res.status(401).json({ error: 'Token no válido - formato incorrecto' });

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await jwtAdapter.validateToken<{ id: string }>(token);
      if (!payload) return res.status(401).json({ error: 'Token no válido - payload incorrecto' });

      const user = await User.findOneBy({ id: payload.id });
      
      if (!user) return res.status(401).json({ error: 'Token no válido - usuario no encontrado' });

      req.body = req.body || {};
      req.body.user = UserEntity.fromObject(user);
      
      next();

    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}