import { envs } from './config';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { PostgresDatabase } from './data/postgres';


(async()=> {
  await main();
})();


async function main() {

  //* Inicialización de la base de datos
  await PostgresDatabase.connect({
    url: envs.POSTGRES_URL,
    dbName: envs.POSTGRES_DB,
  });

  //* Inicialización del servidor
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  //* Server start
  server.start();
}