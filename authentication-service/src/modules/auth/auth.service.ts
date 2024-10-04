import { BadRequestException, ForbiddenException, Get, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
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
import { ConfirmAuthencodeRequest } from "./dto/request/confirm-authencode-request.dto";
import { access } from "fs";
import resetTokenConfig from "src/config/reset-token.config";
import { KafkaService } from "../kafka/kafka.service";
import { LoginResponse } from "./dto/response/login-response.dto";
import { Profile } from "src/entity";


@Injectable()
export class AuthService{
    constructor(
        @Inject(refreshTokenConfig.KEY) private readonly refeshTokenConfig: ConfigType<typeof refreshTokenConfig>,
        @Inject(resetTokenConfig.KEY) private readonly resetPasswordTokenConfig: ConfigType<typeof resetTokenConfig>,
        private readonly _jwtService: JwtService,
        private readonly _configService: ConfigService,
        private readonly _accountService: AccountService,
        private readonly _profileService: ProfileService,
        private readonly _permissionSerivce: PermissionService,
        private readonly _authRepository: AuthRepository,
        @InjectRedis() private readonly redis: Redis,
        private readonly kafkaService: KafkaService,
        
    ){}
    async getPermissionsOfUser(id: string) {
        return this._authRepository.getPermissionsOfUser(id);
    }
    // async getAllUsersWithPermission(permissionId: string) {
    //     return this._authRepository.getAllUsersWithPermission(permissionId);
    // }
    async getMe(id: string){
        const account = await this._accountService.findById(id);
        if (account) {
            const permission = await this._permissionSerivce.getPermissionsOfUser(account.id);
            const p = permission.map(e=>{
                return (`${e.module}:${e.action}`)
            })
            return {
                name: account.profile.firstName + ' ' + account.profile.lastName,
                permissions: p
            };
        }
        throw new UnauthorizedException('Invalid email or password');
    }
    async login(data: LoginRequest) : Promise<LoginResponse> {
        const account = await this._accountService.findByEmail(data.email);
        if (account && await compare(data.password, account.password)) {
            const { accessToken, refreshToken } = await this.generateTokens(account.id, account.email);
            await this.updateRefreshToken({accountId: account.id, refreshToken: refreshToken});

            const permission = await this._permissionSerivce.getPermissionsOfUser(account.id);
            await this.redis.set('permission:'+account.id,JSON.stringify(permission));
            await this.redis.expire(account.id,this._configService.get('CACHETTL'))
            // await this.redis.del('permission:'+account.id)
            const expiredAt = this._configService.get('JWT_EXPIRE_IN');
            const p = permission.map(e=>{
                return (`${e.module}:${e.action}`)
            })
            return {
                name: account.profile.fullName,
                token: { accessToken, refreshToken,expiredAt, permission: p}
            };
        }
        throw new UnauthorizedException('Invalid email or password');
    }

    async register(data: RegisterRequest){
        if(await this._accountService.findByEmail(data.email)!=null) throw new BadRequestException('email aready exist!');
        const hashedPassword = await hash(data.password);
        const profile = await this._profileService.createProfile({
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            dateOfBirth: data.dateOfBirth,
            phoneNumber: data.phoneNumber
        });
        const account = await this._accountService.haftSave({email:data.email, password: hashedPassword,profileId: profile.id,profile:profile});
        await this._profileService.haftUpdate(profile.id,{
            accountId: account.id
        } )
        await this.kafkaService.emitRegisterEmail(data.email, data.firstName);
        return this.login({email:data.email,password:data.password});
    }

    private async updateRefreshToken(data: UpdateRefreshTokenRequest): Promise<void> {
        await this._accountService.haftUpdate(data.accountId, { refreshToken: data.refreshToken });
    }

    async createAuthenCode(email: string){
        const account = await this._accountService.findByEmail(email)
        const entity = await this._authRepository.createAuthenCode(account.id)
        await this.kafkaService.emitAuthenCode(email, entity.code);

    }

    async confirmAuthencode(data: ConfirmAuthencodeRequest) {
        const account = await this._accountService.findByEmail(data.email)
        if(!account) throw new BadRequestException(' email is not found!');
        if(await this._authRepository.confirmAuthenCode(data.code,account.id)){
            const payload : JwtPayload = { sub: account.id , email: data.email, isResetPass: true, code: data.code};
            const token = await this._jwtService.sign(payload,this.resetPasswordTokenConfig);
            return { accessToken :token};
        }else{
            throw new ForbiddenException(' code is not valid! ');
        }
    }
    async resetPassword(accountId: string, newPassword: string, code: string){
        const hashedPassword = await hash(newPassword)
        if(await this._authRepository.useAuthenCode(code,accountId)){
            await this._accountService.haftUpdate(accountId,{password:hashedPassword})
            return true;
        }else{
            throw new ForbiddenException(' token is used! ');
        }
        return false;
    }
    async refreshToken(refreshToken: string) : Promise<ITokenResponse> {
        const exPayload = ( async () => {
            try {
                return await this._jwtService.verifyAsync(refreshToken, {
                    secret: this._configService.get('REFRESH_TOKEN_SECRET'),
                });
            } catch (error) {
                throw new ForbiddenException('token is invalid!');
            }
        })()
        const account = await this._accountService.findById((await exPayload).sub);
        if (account && account.refreshToken === refreshToken) {
            const payload : JwtPayload = { sub: account.id , email: account.email};
            const token = await this._jwtService.sign(payload);
            const expiredAt = this._configService.get('JWT_EXPIRE_IN');
            return { accessToken : token,expiredAt};
        }else throw new ForbiddenException('token is not valid')
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