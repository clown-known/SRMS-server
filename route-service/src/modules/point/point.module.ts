import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointService } from './point.service';
import { PointController } from './point.controller';
import { PointRepository } from './point.repository';
import { Point } from 'src/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point])],
  controllers: [PointController],
  providers: [PointService, PointRepository],
  exports: [PointService],
})
export class PointModule {}
