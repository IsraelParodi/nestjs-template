import { ResetPassword } from '@iam/domain/entities/reset-password';
import { ResetPasswordEntity } from '../entities/reset-password.entity';

export class ResetPasswordMapper {
  static toDomain(resetPasswordEntity: ResetPasswordEntity): ResetPassword {
    const resetPassword = new ResetPassword(resetPasswordEntity.id);

    resetPassword.email = resetPasswordEntity.email;
    resetPassword.token = resetPasswordEntity.token;

    return resetPassword;
  }

  static toPersistence(resetPassword: ResetPassword): ResetPasswordEntity {
    const entity = new ResetPasswordEntity();

    entity.id = resetPassword.id;
    entity.email = resetPassword.email;
    entity.token = resetPassword.token;

    return entity;
  }
}
