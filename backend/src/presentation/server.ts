import express, { Router } from 'express';
import cors from 'cors';
import { envs } from '../config';
interface Options {
  port: number;
  routes: Router;
}


export class Server {

  public readonly app = express();
  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes } = options;
    this.port = port;
    this.routes = routes;
  }

  
  
  async start() {
    

    //* Middlewares
    this.app.use( cors({
      origin: envs.FRONTEND_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    this.app.use( express.json() ); // raw
    this.app.use( express.urlencoded({ extended: true }) ); // x-www-form-urlencoded

    //* Routes
    this.app.use( this.routes );
    
    //* Server is running
    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port http://localhost:${ this.port }`);
    });

  }

  public close() {
    this.serverListener?.close();
  }

}