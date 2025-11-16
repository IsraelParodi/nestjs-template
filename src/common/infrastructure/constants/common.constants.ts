export const BO_URL = () => ({
  LOCAL: process.env.LOCAL_BO_FRONTEND_URL,
  TEST: process.env.LOCAL_BO_FRONTEND_URL,
  DEV: process.env.DEV_BO_FRONTEND_URL,
  PROD: process.env.PROD_BO_FRONTEND_URL,
});
