import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Options {
  url: string;
  dbName: string;
}

export class PostgresDatabase {

  private static dataSource: DataSource;

  static async connect(options: Options): Promise<boolean> {
    const { url, dbName } = options;

    this.dataSource = new DataSource({
      type: 'postgres',
      url,
      database: dbName,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      entities: [`${__dirname}/entities/**/*.{ts,js}`],
      migrations: [`${__dirname}/migrations/**/*.{ts,js}`],
    });

    try {
      await this.dataSource.initialize();
      console.log('Postgres connected');
      return true;
    } catch (error) {
      console.log('Postgres connection error');
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    await this.dataSource?.destroy();
  }
}