import { BadRequestException, Get, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService, ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { refreshTokenConfig } from "src/config";
import { LoginRequest } from "./dto/request/login-request.dto";
import { ITokenResponse } from "./dto/token.interface";
import { compare } from "bcrypt";
import { UpdateRefreshTokenRequest } from "./dto/request/update-refresh-token-request.dto";
import { JwtResponse } from "./dto/response/jwt-response.dto";
import { JwtPayload } from "src/inteface/jwt.payload";
import { AccountService } from "../account/account.service";
import { RegisterRequest } from "./dto/request/register-request.dto";
import { RegisterResponse } from "./dto/response/register-response.dto";
import { plainToInstance } from "class-transformer";
import { hash } from "src/common/security";
import { ProfileService } from "../profile/profile.service";
import { Redis } from "ioredis";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { PermissionService } from "../permission/permission.service";
import { AuthRepository } from "./auth.repository";

@Injectable()
export class AuthService{
    constructor(
        @Inject(refreshTokenConfig.KEY) private readonly refeshTokenConfig: ConfigType<typeof refreshTokenConfig>,
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
        private readonly _accountService: AccountService,
        private readonly _profileService: ProfileService,
        private readonly _permissionSerivce: PermissionService,
        private readonly _authRepository: AuthRepository,
        @InjectRedis() private readonly redis: Redis,
        
    ){}
    async getPermissionsOfUser(id: string) {
        return this._authRepository.getPermissionsOfUser(id);
    }
    // async getAllUsersWithPermission(permissionId: string) {
    //     return this._authRepository.getAllUsersWithPermission(permissionId);
    // }
    async login(data: LoginRequest) : Promise<ITokenResponse> {
        const account = await this._accountService.findByEmail(data.email);
        if (account && await compare(data.password, account.password)) {
            const { accessToken, refreshToken } = await this.generateTokens(account.id, account.email);
            await this.updateRefreshToken({accountId: account.id, refreshToken: refreshToken});

            const permission = await this._permissionSerivce.getPermissionsOfUser(account.id);
            await this.redis.set('permission:'+account.id,JSON.stringify(permission));
            await this.redis.expire(account.id,86400)
            // await this.redis.del('permission:'+account.id)
            return { accessToken, refreshToken };
        }
        throw new UnauthorizedException('Invalid email or password');
    }

    async register(data: RegisterRequest){
        console.log( await this._accountService.findByEmail(data.email));
        if(await this._accountService.findByEmail(data.email)!=null) throw new BadRequestException('email aready exist!');
        const hashedPassword = await hash(data.password);
        const profile = await this._profileService.createProfile(data);
        const account = await this._accountService.haftSave({...data, password: hashedPassword,profileId: profile.id,profile:profile});
        return plainToInstance(RegisterResponse,{...account,profile});
    }

    private async updateRefreshToken(data: UpdateRefreshTokenRequest): Promise<void> {
        await this._accountService.haftUpdate(data.accountId, { refreshToken: data.refreshToken });
    }

    async refreshToken(refreshToken: string) : Promise<JwtResponse> {
        return this._accountService.refreshToken(refreshToken);
    }

    async generateTokens(id: string, email: string): Promise<ITokenResponse> {
        const payload : JwtPayload = { sub: id , email: email};
        const [accessToken, refreshToken] = await Promise.all([
            this._jwtService.sign(payload),
            this._jwtService.sign(payload,this.refeshTokenConfig),
        ]);
        return { accessToken, refreshToken };
    }
    async logout(id: string) {
        return this._accountService.haftUpdate(id, { refreshToken: null });
    }
}