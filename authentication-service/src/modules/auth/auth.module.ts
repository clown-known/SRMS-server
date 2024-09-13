import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { jwtConfig, refreshTokenConfig } from "src/config";
import { JwtStrategy } from "src/stragery/jwt.strangery";
import { RefreshTokenStrategy } from "src/stragery/refreshToken.strategy";
import { AuthenticationController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AccountModule } from "../account/account.module";
import { ProfileModule } from "../profile/profile.module";
import { PermissionModule } from "../permission/permission.module";
import { AuthRepository } from "./auth.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthenticationCode } from "src/entity/authentication_code";
import resetTokenConfig from "src/config/reset-token.config";
import { JwtResetPasswordStrategy } from "src/stragery/jwt.reset.password.strategy";
import { AuthGrpcService } from "./auth.grpc.service";
import { KafkaModule } from "../kafka/kafka.module";

@Global()
@Module({
  imports: [ 
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()), 
    TypeOrmModule.forFeature([AuthenticationCode]),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    ConfigModule.forFeature(resetTokenConfig),
    AccountModule,ProfileModule,PermissionModule, KafkaModule
  ],
  providers: [JwtStrategy, RefreshTokenStrategy, JwtResetPasswordStrategy, ConfigService,AuthService,AuthRepository,],
  controllers:[AuthenticationController,AuthGrpcService],
  exports: [JwtModule, JwtStrategy, RefreshTokenStrategy,AuthService,JwtResetPasswordStrategy],
})
export class AuthModule {}