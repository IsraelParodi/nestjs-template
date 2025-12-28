import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

interface ResetPasswordRequestDto {
  token: string;
  password: string;
}

/**
 * Lambda handler for password reset
 * POST /authentication/reset-password
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<ResetPasswordRequestDto>(event.body);

      // TODO: Instantiate and execute ResetPasswordUseCase
      // const command: ResetPasswordCommand = {
      //   token: body.token,
      //   password: body.password,
      // };
      // await resetPasswordUseCase.execute(command);

      // Placeholder response
      const result = {
        message: 'Password has been reset successfully',
        success: true,
      };

      return result;
    },
    event,
    context,
  );
}
