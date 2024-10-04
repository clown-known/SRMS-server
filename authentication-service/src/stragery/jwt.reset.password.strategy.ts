import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtPayload } from "src/inteface/jwt.payload";
import { Inject, Injectable } from "@nestjs/common";
import { jwtConfig } from "src/config";
import resetTokenConfig from "src/config/reset-token.config";


@Injectable()
export class JwtResetPasswordStrategy extends PassportStrategy(Strategy, 'jwt-pass') {
    constructor(
    private readonly _jwtService: JwtService,
    @Inject(resetTokenConfig.KEY)
    private readonly resetTokenConfiguration: ConfigType<typeof resetTokenConfig>
    ) {
    super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:resetTokenConfiguration.secret,
        ignoreExpiration: false,
    });
    }

    async validate(payload: JwtPayload){
        console.log(payload);
        return {
            id: payload.sub,
            email: payload.email, 
            isResetPass: payload.isResetPass,
            code: payload.code
        }
    }
  // ... rest of the code ...
}