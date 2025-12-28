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
 * Lambda handler for getting a user by ID
 * GET /users/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const userId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Instantiate and execute GetUserUseCase
      // const user = await getUserUseCase.execute(userId);

      // Placeholder response
      const result = {
        id: userId,
        email: 'user@example.com',
        name: 'John',
        lastname: 'Doe',
        roleId: 1,
        createdAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
