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
 * Lambda handler for deleting a contact-us request
 * DELETE /contact-us/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const contactUsId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement DeleteContactUsUseCase
      // await deleteContactUsUseCase.execute(contactUsId);

      const result = {
        message: 'Contact-us request deleted successfully',
        id: contactUsId,
      };

      return result;
    },
    event,
    context,
  );
}
