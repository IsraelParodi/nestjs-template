import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

interface DeleteManyUsersRequestDto {
  ids: number[];
}

/**
 * Lambda handler for deleting multiple users (Admin only)
 * POST /users/delete
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<DeleteManyUsersRequestDto>(event.body);

      // TODO: Extract active user from JWT token
      // const activeUser = event.requestContext?.authorizer?.claims;
      // await deleteManyUsersUseCase.execute(body.ids, activeUser.sub);

      // Placeholder response
      const result = {
        message: 'Deleted Successfully',
        ids: body.ids,
      };

      return result;
    },
    event,
    context,
  );
}
