import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from '../../entity/role';
import { RolePermissions } from '../../entity/role.permissions';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleRepository } from './role.repository';
import { RolePermissionRepository } from './role.permission.repository';
import { PermissionService } from '../permission/permission.service';
import { PermissionModule } from '../permission/permission.module';
import { RolePermissionSubscriber } from '../../subcriber/role-permission.subscriber';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Roles, RolePermissions]),
    PermissionModule,
    //AuthService
  ],
  controllers: [RoleController],
  providers: [
    RoleService, 
    RoleRepository, RolePermissionRepository,
    RolePermissionSubscriber,
    
  ],
  exports: [RoleService], 
})
export class RoleModule {}