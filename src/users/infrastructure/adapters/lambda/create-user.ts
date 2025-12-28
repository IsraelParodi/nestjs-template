import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
} from '../../../../lambda/utils/lambda-response';

interface CreateUserRequestDto {
  email: string;
  password: string;
  name: string;
  lastname: string;
  roleId?: number;
  [key: string]: any;
}

/**
 * Lambda handler for creating a user (Admin only)
 * POST /users
 */
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<CreateUserRequestDto>(event.body);

      // TODO: Extract active user from JWT token
      // const activeUser = event.requestContext?.authorizer?.claims;
      // const command: CreateUserCommand = {
      //   ...body,
      //   createdBy: activeUser.sub,
      // };
      // const user = await createUserUseCase.execute(command);

      // Placeholder response
      const result = {
        id: 1,
        email: body.email,
        name: body.name,
        lastname: body.lastname,
        roleId: body.roleId,
        createdAt: new Date().toISOString(),
      };

      return result;
    },
    event,
    context,
  );
}
