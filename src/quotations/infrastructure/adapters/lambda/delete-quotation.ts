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
 * Lambda handler for deleting a quotation
 * DELETE /quotations/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const quotationId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement DeleteQuotationUseCase
      // await deleteQuotationUseCase.execute(quotationId);

      const result = {
        message: 'Quotation deleted successfully',
        id: quotationId,
      };

      return result;
    },
    event,
    context,
  );
}
