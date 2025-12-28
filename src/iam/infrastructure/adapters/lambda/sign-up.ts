import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';
import { SignUpUseCase } from '@iam/application/ports/inbound/authentication/sign-up.use-case';
import { SignUpCommand } from '@iam/application/commands/authentication/sign-up.command';
import { diContainer } from '../../../../lambda/utils/di-container';

interface SignUpRequestDto {
  email: string;
  password: string;
  name: string;
  lastname: string;
  businessTaxId?: string;
  legalName?: string;
  country?: string;
}

/**
 * Lambda handler for user sign-up
 * POST /authentication/sign-up
 *
 * Leverages NestJS DI container for all service resolution
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      // Initialize NestJS app on first invocation (warm start optimization)
      if (!diContainer.isInitialized()) {
        await diContainer.initialize();
      }

      const body = parseJsonBody<SignUpRequestDto>(event.body);

      // Create the sign-up command with request data
      const command: SignUpCommand = {
        email: body.email,
        password: body.password,
        name: body.name,
        lastname: body.lastname,
        businessTaxId: body.businessTaxId || '',
        legalName: body.legalName || '',
        country: body.country
          ? Number.parseInt(body.country as any)
          : undefined,
      };

      // Get SignUpUseCase from NestJS DI container
      const signUpUseCase = diContainer.get<SignUpUseCase>(SignUpUseCase);

      // Execute the use case
      const result = await signUpUseCase.execute(command);

      return result;
    },
    event,
    context,
  );
}
