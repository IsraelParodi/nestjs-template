import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { PageableService } from './services/pageable.service';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { AuthInspectorService } from './services/auth-inspector.service';
import { CommonController } from './controllers/common.controller';
import { UnitOfWork } from './services/unit-of-work.service';

@Global()
@Module({
  imports: [ConfigModule, DiscoveryModule],
  providers: [
    PageableService,
    AuthInspectorService,
    MetadataScanner,
    UnitOfWork,
  ],
  controllers: [CommonController],
  exports: [PageableService, UnitOfWork],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
