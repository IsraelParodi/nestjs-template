import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { HashingService } from '@iam/infrastructure/hashing/hashing.service';
import { AuthenticationService } from '../../services/authentication.service';
import { UserRepository } from '@users/application/ports/outbound/user.repository';
import { SignInCommand } from '@iam/application/commands/authentication/sign-in.command';
import { SignInUseCase } from '@iam/application/ports/inbound/authentication/sign-in.use-case';

@Injectable()
export class SignInService implements SignInUseCase {
  private readonly logger: Logger = new Logger(SignInService.name);

  constructor(
    private readonly hashingService: HashingService,
    private readonly authenticationService: AuthenticationService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: SignInCommand) {
    try {
      const user = await this.userRepository.findByEmail(dto.email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isEqual = await this.hashingService.compare(
        dto.password,
        user.passwordHash,
      );

      if (!isEqual) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return await this.authenticationService.generateTokens(user);
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
