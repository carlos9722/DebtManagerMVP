import 'dotenv/config';
import env from 'env-var';


export const envs = {

  PORT: env.get('PORT').required().asPortNumber(),
  POSTGRES_URL: env.get('POSTGRES_URL').required().asString(),
  POSTGRES_DB: env.get('POSTGRES_DB').required().asString(),
  NODE_ENV: env.get('NODE_ENV').required().asString(),


}