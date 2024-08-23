import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './service/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { postgresOptions } from './service/config/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './stragery/jwt.strangery';
import { RefreshTokenStrategy } from './stragery/refreshToken.strategy';
import {jwtConfig,refreshTokenConfig} from './service/config/index';
import { AccountRepository, PermissionRepository, ProfileRepository, RoleRepository } from './repository';
import { RolePermissionRepository } from './repository/role.permission.repository';
import { RolePermissions } from './entity/role.permissions';
import { Permission } from './entity/permission';
import { Roles } from './entity/role';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';
import { RoleService } from './service/role.service';
import { PermissionService } from './service/permission.service';
import { ProfileService } from './service/profile.service';
import { Profile } from './entity/profile';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true
    }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([Account,Roles,Permission,RolePermissions,Profile]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig)
  ],
  controllers: [AuthenticationController,RoleController,PermissionController],
  providers: [
    AuthenticationService,ConfigService,RoleService,PermissionService,ProfileService,
    JwtStrategy,RefreshTokenStrategy,
    AccountRepository,RoleRepository,PermissionRepository,RolePermissionRepository,ProfileRepository
  ],
})
export class AppModule {}
