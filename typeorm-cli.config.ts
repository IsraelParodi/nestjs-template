import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const appEnv = process.env.APP_ENV ?? 'DEV';

dotenv.config({
  path:
    appEnv === 'TEST'
      ? '.env.test'
      : appEnv === 'production'
        ? '.env.production'
        : '.env.development',
});

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  ssl: ['PROD', 'STAGING'].includes(process.env.APP_ENV || '')
    ? { ca: process.env.CA_CERT }
    : false,
});
