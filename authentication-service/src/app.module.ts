import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { postgresOptions } from './config/data-source';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig,refreshTokenConfig } from './config/index';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/response.interceptor';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { redisOptions } from './config/redis-options';
import { JwtStrategy } from './stragery/jwt.strangery';
import { RefreshTokenStrategy } from './stragery/refreshToken.strategy';
import { JwtResetPasswordStrategy } from './stragery/jwt.reset.password.strategy';
import resetTokenConfig from './config/reset-token.config';

@Module({
  imports: [
    RedisModule.forRootAsync(redisOptions),
    ConfigModule.forRoot({
      expandVariables: true
    }),
    TypeOrmModule.forRoot(postgresOptions),

    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    ConfigModule.forFeature(resetTokenConfig),
    AccountModule,AuthModule,PermissionModule,RoleModule,ProfileModule
  ],
  controllers: [],
  providers: [
    ConfigService,
    JwtStrategy,RefreshTokenStrategy,JwtResetPasswordStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    }
  ],
})
export class AppModule {}
