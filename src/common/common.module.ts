import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { PageableService } from './services/pageable.service';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { AuthInspectorService } from './services/auth-inspector.service';
import { AuthInspectorController } from './controllers/auth-inspector.controller';

@Global()
@Module({
  imports: [ConfigModule, DiscoveryModule],
  providers: [PageableService, AuthInspectorService, MetadataScanner],
  controllers: [AuthInspectorController],
  exports: [PageableService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
