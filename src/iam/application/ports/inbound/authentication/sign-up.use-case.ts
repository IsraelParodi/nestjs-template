import { Injectable } from '@nestjs/common';
import { SignUpCommand } from '@iam/application/commands/authentication/sign-up.command';

@Injectable()
export abstract class SignUpUseCase {
  abstract execute(dto: SignUpCommand);
}
