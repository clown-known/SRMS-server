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
import { AccountRepository, PermissionRepository, RoleRepository } from './repository';
import { RolePermissionRepository } from './repository/role.permission.repository';
import { RolePermissions } from './entity/role.permissions';
import { Permission } from './entity/permission';
import { Roles } from './entity/role';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true
    }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([Account,Roles,Permission,RolePermissions]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig)
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,ConfigService,
    JwtStrategy,RefreshTokenStrategy,
    AccountRepository,RoleRepository,PermissionRepository,RolePermissionRepository
  ],
})
export class AppModule {}
