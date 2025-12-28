import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';

export interface LambdaResponse<T = any> {
  succeeded: boolean;
  message: string;
  timestamp: string;
  error?: any;
  path?: string;
  payload: T | null;
}

export class LambdaResponseFormatter {
  static success<T>(
    data: T,
    statusCode: number = 200,
    message: string = 'Request successful',
  ): LambdaResponse<T> {
    return {
      succeeded: true,
      message,
      timestamp: new Date().toISOString(),
      payload: data,
    };
  }

  static error(
    statusCode: number,
    message: string,
    error?: any,
    path?: string,
  ): LambdaResponse {
    return {
      succeeded: false,
      message,
      timestamp: new Date().toISOString(),
      error,
      path,
      payload: null,
    };
  }
}

export interface LambdaHandlerResult {
  statusCode: number;
  body: string;
  headers?: Record<string, string>;
}

export function createLambdaResponse(
  data: LambdaResponse,
  statusCode: number = 200,
): LambdaHandlerResult {
  return {
    statusCode,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}

export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  try {
    const result = await fn();
    const response = LambdaResponseFormatter.success(result);
    return createLambdaResponse(response, 200);
  } catch (error: any) {
    console.error('Lambda handler error:', error);

    const statusCode = error.response.statusCode || 500;
    const message = error.message || 'Internal server error';
    const errorResponse = LambdaResponseFormatter.error(
      statusCode,
      message,
      error.response,
      event.path,
    );

    return createLambdaResponse(errorResponse, statusCode);
  }
}

export function parseJsonBody<T>(body: string | null): T {
  try {
    return body ? JSON.parse(body) : ({} as T);
  } catch {
    throw new Error('Invalid JSON in request body');
  }
}

export function getPathParameter(
  event: APIGatewayProxyEvent,
  paramName: string,
): string {
  const value = event.pathParameters?.[paramName];
  if (!value) {
    throw new Error(`Missing path parameter: ${paramName}`);
  }
  return value;
}

export function getQueryParameter(
  event: APIGatewayProxyEvent,
  paramName: string,
): string | undefined {
  return event.queryStringParameters?.[paramName];
}
