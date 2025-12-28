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
 * Lambda handler for getting a LOV (List of Values) item
 * GET /lov/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const lovId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement GetLOVUseCase
      // const result = await getLOVUseCase.execute(lovId);

      const result = {
        id: lovId,
        key: 'LOV_KEY',
        value: 'LOV Value',
        description: 'Description',
      };

      return result;
    },
    event,
    context,
  );
}
