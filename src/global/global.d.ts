import { ActiveUserData } from '@iam/infrastructure/interfaces/active-user-data.interface';

declare global {
  namespace Express {
    interface Request {
      user: ActiveUserData;
    }
  }
}
