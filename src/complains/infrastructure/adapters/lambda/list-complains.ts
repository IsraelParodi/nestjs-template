import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  getQueryParameter,
} from '../../../../lambda/utils/lambda-response';

/**
 * Lambda handler for listing complains
 * GET /complains
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const page = parseInt(getQueryParameter(event, 'page') || '1', 10);
      const limit = parseInt(getQueryParameter(event, 'limit') || '100', 10);

      // TODO: Implement ListComplainsUseCase
      // const result = await listComplainsUseCase.execute({ page, limit });

      const result = {
        data: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
      };

      return result;
    },
    event,
    context,
  );
}
