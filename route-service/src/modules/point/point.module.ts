import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { Point } from 'src/entity';
import { PointRepository } from './point.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  controllers: [PointController],
  providers: [PointService, PointRepository],
  exports: [PointService, PointRepository],
})
export class PointModule {}
