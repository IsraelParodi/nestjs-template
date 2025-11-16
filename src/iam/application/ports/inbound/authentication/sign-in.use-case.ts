import { SignInCommand } from '@iam/application/commands/authentication/sign-in.command';

export abstract class SignInUseCase {
  abstract execute(dto: SignInCommand);
}
