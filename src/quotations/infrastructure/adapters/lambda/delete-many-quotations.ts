import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

/**
 * Lambda handler for deleting multiple quotations
 * POST /quotations/delete
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<{ ids: number[] }>(event.body);

      // TODO: Implement DeleteManyQuotationsUseCase
      // await deleteManyQuotationsUseCase.execute(body.ids);

      const result = {
        message: 'Quotations deleted successfully',
        ids: body.ids,
      };

      return result;
    },
    event,
    context,
  );
}
