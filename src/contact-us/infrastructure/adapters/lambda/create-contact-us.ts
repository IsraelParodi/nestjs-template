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
 * Lambda handler for creating contact-us request
 * POST /contact-us
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<any>(event.body);

      // TODO: Implement CreateContactUsUseCase
      // const result = await createContactUsUseCase.execute(body);

      const result = {
        id: 1,
        ...body,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      return result;
    },
    event,
    context,
  );
}
