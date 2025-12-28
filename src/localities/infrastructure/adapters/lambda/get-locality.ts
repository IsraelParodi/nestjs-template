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
 * Lambda handler for getting a locality
 * GET /localities/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const localityId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement GetLocalityUseCase
      // const result = await getLocalityUseCase.execute(localityId);

      const result = {
        id: localityId,
        name: 'Locality Name',
        stateId: 1,
        countryId: 1,
      };

      return result;
    },
    event,
    context,
  );
}
