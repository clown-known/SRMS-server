import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from './entity/route';
import { Point } from './entity/point';
import { RouteService } from './service/route.service';
import { RouteController } from './route.controller';
import { PointService } from './service/point.service';
import { PointController } from './point.controller';
import { RouteRepository } from './repository/route.repository';
import { PointRepository } from './repository/point.repository';
import { ConfigModule } from '@nestjs/config';
import { postgresOptions } from './service/config/data-source';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response.interceptor';


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
