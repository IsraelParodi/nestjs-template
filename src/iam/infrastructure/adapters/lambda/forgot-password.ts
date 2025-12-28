import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

interface ForgotPasswordRequestDto {
  email: string;
}

/**
 * Lambda handler for forgot password request
 * POST /authentication/forgot-password
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<ForgotPasswordRequestDto>(event.body);

      // TODO: Instantiate and execute ForgotPasswordUseCase
      // const command: ForgotPasswordCommand = {
      //   email: body.email,
      // };
      // await forgotPasswordUseCase.execute(command);

      // Placeholder response
      const result = {
        message: 'Password reset link has been sent to your email',
        email: body.email,
      };

      return result;
    },
    event,
    context,
  );
}
