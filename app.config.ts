const appConfig = () => ({
  environment: process.env.APP_ENV || 'DEV',
  port: parseInt(process.env.PORT ?? '3000', 10),

  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number.parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    user: process.env.DATABASE_USER ?? 'db_owner',
    password: process.env.DATABASE_PASSWORD ?? '123456',
    name: process.env.DATABASE_NAME ?? 'db_dev',
  },
});

export default appConfig;
