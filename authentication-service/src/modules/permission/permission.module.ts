import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../entity/permission';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
  ],
  controllers: [PermissionController], 
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}