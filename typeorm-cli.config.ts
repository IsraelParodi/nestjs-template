import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';

dotenv.config({
  path:
    nodeEnv === 'test'
      ? '.env.test'
      : nodeEnv === 'production'
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
  ssl: ['PROD', 'STAGING'].includes(process.env.NODE_ENV || '')
    ? { ca: process.env.CA_CERT }
    : false,
});
