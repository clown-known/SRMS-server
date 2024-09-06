import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOptions } from './config/data-source';
import { RouteModule } from './modules/route/route.module';
import { PointModule } from './modules/point/point.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(postgresOptions),
    RouteModule,
    PointModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
