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
 * Lambda handler for creating a quotation
 * POST /quotations
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<any>(event.body);

      // TODO: Implement CreateQuotationTransactionalUseCase
      // const result = await createQuotationUseCase.execute(body);

      const result = {
        id: 1,
        ...body,
        createdAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
