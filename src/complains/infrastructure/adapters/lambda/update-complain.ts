import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
  getPathParameter,
} from '../../../../lambda/utils/lambda-response';

/**
 * Lambda handler for updating a complain
 * PATCH /complains/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const complainId = parseInt(getPathParameter(event, 'id'), 10);
      const body = parseJsonBody<any>(event.body);

      // TODO: Implement UpdateComplainUseCase
      // const result = await updateComplainUseCase.execute(complainId, body);

      const result = {
        id: complainId,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
