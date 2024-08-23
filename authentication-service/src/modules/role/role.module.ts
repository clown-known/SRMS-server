import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../../entity/role';
import { RolePermissions } from '../../entity/role.permissions';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { RolePermissionRepository } from './role.permission.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, RolePermissions]),
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository, RolePermissionRepository],
  exports: [RoleService], 
})
export class RoleModule {}