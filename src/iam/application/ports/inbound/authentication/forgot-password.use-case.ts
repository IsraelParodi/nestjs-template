import { ForgotPasswordDto } from '@iam/presenters/dto/iam/forgot-password.dto';

export abstract class ForgotPasswordUseCase {
  abstract execute({ email }: ForgotPasswordDto);
}
