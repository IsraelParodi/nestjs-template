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
 * Lambda handler for getting a contact-us request
 * GET /contact-us/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const contactUsId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement GetContactUsUseCase
      // const result = await getContactUsUseCase.execute(contactUsId);

      const result = {
        id: contactUsId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
