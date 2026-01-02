import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { PostgresDatabase } from './data/postgres';


(async()=> {
  await main();
})();


async function main() {

  //* Database initialization
  await PostgresDatabase.connect({
    url: envs.POSTGRES_URL,
    dbName: envs.POSTGRES_DB,
  });

  //* Server initialization
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes,
  });

  //* Server start
  server.start();
}