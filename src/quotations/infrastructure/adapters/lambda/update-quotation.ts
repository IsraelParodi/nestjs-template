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
 * Lambda handler for updating a quotation
 * PATCH /quotations/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const quotationId = parseInt(getPathParameter(event, 'id'), 10);
      const body = parseJsonBody<any>(event.body);

      // TODO: Implement UpdateQuotationUseCase
      // const result = await updateQuotationUseCase.execute(quotationId, body);

      const result = {
        id: quotationId,
        ...body,
        updatedAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
