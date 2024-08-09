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
import jwtConfig from './service/config/jwt.config';
@Module({
  imports: [
    // ConfigModule.forRoot(),
    TypeOrmModule.forRoot(postgresOptions),
    TypeOrmModule.forFeature([Account]),
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtService,ConfigService,JwtStrategy,RefreshTokenStrategy],
})
export class AppModule {}
