import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
  getPathParameter,
} from '../../../../lambda/utils/lambda-response';

interface UpdateUserRequestDto {
  email?: string;
  name?: string;
  lastname?: string;
  roleId?: number;
  [key: string]: any;
}

/**
 * Lambda handler for updating a user
 * PATCH /users/{id}
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const userId = parseInt(getPathParameter(event, 'id'), 10);
      const body = parseJsonBody<UpdateUserRequestDto>(event.body);

      // TODO: Extract active user from JWT token
      // const activeUser = event.requestContext?.authorizer?.claims;
      // const command: UpdateUserCommand = {
      //   ...body,
      //   updatedBy: activeUser.sub,
      // };
      // const user = await updateUserUseCase.execute(userId, command);

      // Placeholder response
      const result = {
        id: userId,
        email: body.email || 'user@example.com',
        name: body.name || 'John',
        lastname: body.lastname || 'Doe',
        roleId: body.roleId || 1,
        updatedAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
