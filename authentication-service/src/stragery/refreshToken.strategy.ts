import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { refreshTokenConfig } from 'src/config';
import { JwtPayload } from 'src/inteface/jwt.payload';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy,'jwt-refresh',) 
{
  constructor(
    @Inject(refreshTokenConfig.KEY)
    private readonly refreshJwtConfiguration: ConfigType<typeof refreshTokenConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refreshJwtConfiguration.secret,
      passReqToCallback: true, 
      ignoreExpiration: false,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}