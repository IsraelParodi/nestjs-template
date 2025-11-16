import { DomainException } from '@common/domain/exceptions/domain.exception';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, error } = this.normalizeException(exception);

    if (status >= 500) {
      this.logger.error(
        `Unhandled exception at ${request.method} ${request.url}`,
        (exception as any)?.stack,
      );
    } else {
      this.logger.warn(
        `Request error at ${request.method} ${request.url}: ${error?.message}`,
      );
    }

    return response.status(status).json({
      succeeded: false,
      message: 'Request failed',
      timestamp: new Date().toISOString(),
      error,
      path: request.url,
      payload: null,
    });
  }

  private normalizeException(exception: unknown): {
    status: number;
    error: any;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      const error =
        typeof res === 'string' ? { message: res } : (res as object);

      return { status, error };
    }

    if (exception instanceof DomainException) {
      return {
        status: HttpStatus[String(HttpStatus[exception.statusCode])],
        error: {
          error: exception.code,
          message: exception.message,
          statusCode: Number(exception.statusCode),
        },
      };
    }
  }
}
