import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import {
  withErrorHandling,
  parseJsonBody,
  getPathParameter,
  getQueryParameter,
  createLambdaResponse,
  LambdaResponseFormatter,
} from '../utils/lambda-response';

// This is a template for Lambda handlers.
// Each controller method will be converted into a Lambda handler following this pattern.

// Example: Authentication SignUp Handler
export async function signUpHandler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const body = parseJsonBody<{
        email: string;
        password: string;
        name: string;
        lastname: string;
        businessTaxId?: string;
        legalName?: string;
        country?: string;
      }>(event.body);

      // TODO: Inject and call SignUpUseCase
      // const result = await signUpUseCase.execute(command);

      return {
        id: '1',
        email: body.email,
        name: body.name,
      };
    },
    event,
    context,
  );
}

// Example: Users GetUser Handler
export async function getUserHandler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  return withErrorHandling(
    async () => {
      const userId = getPathParameter(event, 'id');

      // TODO: Inject and call GetUserUseCase
      // const user = await getUserUseCase.execute({ id: userId });

      return {
        id: userId,
        email: 'user@example.com',
        name: 'John Doe',
      };
    },
    event,
    context,
  );
}

// Example: Users ListUsers Handler
export async function listUsersHandler(
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

      // TODO: Inject and call ListUsersUseCase
      // const result = await listUsersUseCase.execute(query);

      return {
        data: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
      };
    },
    event,
    context,
  );
}
