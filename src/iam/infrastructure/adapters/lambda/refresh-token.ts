import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

interface RefreshTokenRequestDto {
  refreshToken: string;
}

/**
 * Lambda handler for token refresh
 * POST /authentication/refresh-tokens
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<RefreshTokenRequestDto>(event.body);

      // TODO: Instantiate and execute RefreshTokenUseCase
      // const command: RefreshTokenCommand = {
      //   refreshToken: body.refreshToken,
      // };
      // const result = await refreshTokenUseCase.execute(command);

      // Placeholder response
      const result = {
        accessToken: 'new_access_token_placeholder',
        refreshToken: 'new_refresh_token_placeholder',
      };

      return result;
    },
    event,
    context,
  );
}
