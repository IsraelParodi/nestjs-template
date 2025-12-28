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
 * Lambda handler for deleting a user
 * DELETE /users/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const userId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Extract active user from JWT token
      // const activeUser = event.requestContext?.authorizer?.claims;
      // await deleteUserUseCase.execute(userId, activeUser.sub);

      // Placeholder response
      const result = {
        message: 'Deleted Successfully',
        id: userId,
      };

      return result;
    },
    event,
    context,
  );
}
