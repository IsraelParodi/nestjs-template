import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  getPathParameter,
} from '../../../../lambda/utils/lambda-response';

/**
 * Lambda handler for getting a complain
 * GET /complains/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const complainId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement GetComplainUseCase
      // const result = await getComplainUseCase.execute(complainId);

      const result = {
        id: complainId,
        status: 'open',
        createdAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
