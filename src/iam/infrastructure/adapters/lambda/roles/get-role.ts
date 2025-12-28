import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  getPathParameter,
} from '../../../../../lambda/utils/lambda-response';

/**
 * Lambda handler for getting a role
 * GET /roles/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const roleId = parseInt(getPathParameter(event, 'id'), 10);

      // TODO: Implement GetRoleUseCase
      // const result = await getRoleUseCase.execute(roleId);

      const result = {
        id: roleId,
        name: 'Admin',
        description: 'Administrator role',
        permissions: [],
      };

      return result;
    },
    event,
    context,
  );
}
