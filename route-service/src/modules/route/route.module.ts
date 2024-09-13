import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { RouteRepository } from './route.repository';
import { Route } from 'src/entity';
import { PointModule } from '../point/point.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Route]), 
    PointModule,
    AuthModule
  ],
  controllers: [RouteController],
  providers: [RouteService, RouteRepository],
  exports: [RouteService],
})
export class RouteModule {}
