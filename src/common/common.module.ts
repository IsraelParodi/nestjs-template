import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './infrastructure/middleware/logging.middleware';
import { PageableService } from './services/pageable.service';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import { AuthInspectorService } from './services/auth-inspector.service';
import { CommonController } from './presenters/http/controllers/common.controller';
import { UnitOfWorkPort } from './application/ports/outbound/unit-of-work.port';
import { TypeormUnitOfWork } from './infrastructure/persistance/typeorm/typeorm-unit-of-work';

@Global()
@Module({
  imports: [ConfigModule, DiscoveryModule],
  providers: [
    PageableService,
    AuthInspectorService,
    MetadataScanner,
    {
      provide: UnitOfWorkPort,
      useClass: TypeormUnitOfWork,
    },
  ],
  controllers: [CommonController],
  exports: [PageableService, UnitOfWorkPort],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
