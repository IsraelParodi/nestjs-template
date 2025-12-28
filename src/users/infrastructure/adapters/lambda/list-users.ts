import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  getQueryParameter,
} from '../../../../lambda/utils/lambda-response';

interface ListUsersQuery {
  page?: string;
  limit?: string;
  name?: string;
  lastname?: string;
  roleId?: string;
}

/**
 * Lambda handler for listing users
 * GET /users
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const page = parseInt(getQueryParameter(event, 'page') || '1', 10);
      const limit = parseInt(getQueryParameter(event, 'limit') || '10', 10);
      const name = getQueryParameter(event, 'name');
      const lastname = getQueryParameter(event, 'lastname');
      const roleId = getQueryParameter(event, 'roleId');

      // TODO: Instantiate and execute ListUsersUseCase
      // const query: ListUsersQuery = {
      //   page,
      //   limit,
      //   name,
      //   lastname,
      //   roleId: roleId ? Number(roleId) : undefined,
      // };
      // const result = await listUsersUseCase.execute(query);

      // Placeholder response
      const result = {
        data: [
          {
            id: 1,
            email: 'user@example.com',
            name: 'John',
            lastname: 'Doe',
            roleId: 1,
          },
        ],
        page,
        limit,
        total: 1,
        totalPages: 1,
      };

      return result;
    },
    event,
    context,
  );
}
