import { Injectable, Logger } from '@nestjs/common';
import { SignUpCommand } from '@iam/application/commands/authentication/sign-up.command';
import { CreateUserUseCase } from '@users/application/ports/inbound/create-user.use-case';
import { SignUpUseCase } from '@iam/application/ports/inbound/authentication/sign-up.use-case';
import { CreateUserCommand } from '@users/application/commands/create-user.command';

@Injectable()
export class SignUpService implements SignUpUseCase {
  private readonly logger: Logger = new Logger(SignUpService.name);

  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(dto: SignUpCommand) {
    try {
      const command: CreateUserCommand = {
        email: dto.email,
        roleId: process.env.APP_ENV === 'TEST' ? 1 : 2,
        password: dto.password,
        name: dto.name,
        lastname: dto.lastname,
        businessTaxId: dto.businessTaxId,
        legalName: dto.legalName,
        countryId: dto.country,
      };

      const response = await this.createUserUseCase.execute(command);
      return { message: 'User created successfully', id: response.id };
    } catch (error) {
      this.logger.debug(`Error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
