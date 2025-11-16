import { ResetPassword } from '@iam/domain/entities/reset-password';

export abstract class ResetPasswordRepository {
  abstract save(resetPassword: ResetPassword): Promise<ResetPassword>;
  abstract findByEmail(email: string): Promise<ResetPassword | null>;
  abstract findByToken(token: string): Promise<ResetPassword | null>;
  abstract delete(token: string): Promise<void>;
}
