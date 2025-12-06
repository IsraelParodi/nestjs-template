const appConfig = () => ({
  environment: process.env.APP_ENV,
  port: Number.parseInt(process.env.PORT, 10),

  database: {
    host: process.env.DATABASE_HOST,
    port: Number.parseInt(process.env.DATABASE_PORT, 10),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
});

export default appConfig;
