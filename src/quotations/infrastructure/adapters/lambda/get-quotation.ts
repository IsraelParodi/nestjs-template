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
 * Lambda handler for getting a quotation
 * GET /quotations/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const quotationId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement GetQuotationUseCase
      // const result = await getQuotationUseCase.execute(quotationId);

      const result = {
        id: quotationId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
