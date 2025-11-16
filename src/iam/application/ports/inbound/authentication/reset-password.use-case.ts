import { ResetPasswordDto } from '@iam/presenters/dto/iam/reset-password.dto';

export abstract class ResetPasswordUseCase {
  abstract execute({ token, password }: ResetPasswordDto);
}
