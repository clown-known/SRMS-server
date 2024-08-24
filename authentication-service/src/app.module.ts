import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { postgresOptions } from './config/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './stragery/jwt.strangery';
import { RefreshTokenStrategy } from './stragery/refreshToken.strategy';
import {jwtConfig,refreshTokenConfig} from './config/index';
import { RolePermissions } from './entity/role.permissions';
import { Permission } from './entity/permission';
import { Roles } from './entity/role';
import { Profile } from './entity/profile';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response.interceptor';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true
    }),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([Account,Roles,Permission,RolePermissions,Profile]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    AccountModule,AuthModule,PermissionModule,RoleModule,ProfileModule
  ],
  controllers: [],
  providers: [
    ConfigService,
    //JwtStrategy,RefreshTokenStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    }
  ],
})
export class AppModule {}
