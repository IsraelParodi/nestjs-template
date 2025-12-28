import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

interface SignInRequestDto {
  email: string;
  password: string;
}

interface SignInResponseDto {
  accessToken: string;
  refreshToken: string;
}

/**
 * Lambda handler for user sign-in
 * POST /authentication/sign-in
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<SignInRequestDto>(event.body);

      // TODO: Instantiate and execute SignInUseCase
      // const command: SignInCommand = {
      //   email: body.email,
      //   password: body.password,
      // };
      // const { accessToken, refreshToken } = await signInUseCase.execute(command);

      // Placeholder response
      const result: SignInResponseDto = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh_token_placeholder',
      };

      return result;
    },
    event,
    context,
  );
}
