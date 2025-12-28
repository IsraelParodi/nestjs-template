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
 * Lambda handler for listing localities
 * GET /localities
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const page = parseInt(getQueryParameter(event, 'page') || '1', 10);
      const limit = parseInt(getQueryParameter(event, 'limit') || '10', 10);
      const countryId = getQueryParameter(event, 'countryId');
      const stateId = getQueryParameter(event, 'stateId');

      // TODO: Implement ListLocalitiesUseCase
      // const result = await listLocalitiesUseCase.execute({ page, limit, countryId, stateId });

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
