import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  getQueryParameter,
} from '../../../../../lambda/utils/lambda-response';

/**
 * Lambda handler for listing roles
 * GET /roles
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const page = parseInt(getQueryParameter(event, 'page') || '1', 10);
      const limit = parseInt(getQueryParameter(event, 'limit') || '10', 10);

      // TODO: Implement ListRolesUseCase
      // const result = await listRolesUseCase.execute({ page, limit });

      const result = {
        data: [
          {
            id: 1,
            name: 'Admin',
            description: 'Administrator role',
          },
          {
            id: 2,
            name: 'User',
            description: 'Regular user role',
          },
        ],
        page,
        limit,
        total: 2,
        totalPages: 1,
      };

      return result;
    },
    event,
    context,
  );
}
