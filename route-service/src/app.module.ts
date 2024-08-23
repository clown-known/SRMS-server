import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route, Point } from './entity';
import { RouteService } from './modules/route/route.service';
import { RouteController } from './modules/route/route.controller';
import { PointService } from './modules/point/point.service';
import { PointController } from './modules/point/point.controller';
import { RouteRepository } from './modules/route/route.repository';
import { PointRepository } from './modules/point/point.repository';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response.interceptor';
import { postgresOptions } from './config/data-source';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([Route, Point])
  ],
  controllers: [RouteController, PointController],
  providers: [
    RouteService, PointService, RouteRepository, PointRepository,
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  }
],
})

export class AppModule {}
