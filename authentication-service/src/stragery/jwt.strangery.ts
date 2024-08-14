import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtPayload } from "src/inteface/jwt.payload";
import { Inject, Injectable } from "@nestjs/common";
import { jwtConfig } from "src/service/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly _jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload){
    return {
      id: payload.sub,
      email: payload.email
    }
  }
  
  // ... rest of the code ...
}