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

@Global()
@Module({
  imports: [ 
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshTokenConfig),
    AccountModule,ProfileModule
  ],
  providers: [JwtStrategy, RefreshTokenStrategy, ConfigService,AuthService],
  controllers:[AuthenticationController],
  exports: [JwtModule, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}