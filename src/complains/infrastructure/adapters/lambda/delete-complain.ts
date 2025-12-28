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
 * Lambda handler for deleting a complain
 * DELETE /complains/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const complainId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement DeleteComplainUseCase
      // await deleteComplainUseCase.execute(complainId);

      const result = {
        message: 'Complain deleted successfully',
        id: complainId,
      };

      return result;
    },
    event,
    context,
  );
}
