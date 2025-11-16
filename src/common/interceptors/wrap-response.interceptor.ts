import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request?.url || '';

    return next.handle().pipe(
      map((data) => ({
        succeeded: true,
        message: 'Request successful',
        timestamp: new Date().toISOString(),
        errors: [],
        path,
        payload: data,
      })),
    );
  }
}
