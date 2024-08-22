import { Inject, Injectable, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entity/account';
import { ConfigService, ConfigType } from '@nestjs/config';
import { compare } from 'bcrypt';
import { hash } from './security';
import { ChangePasswordRequest, CreateAccountRequest, LoginRequest, RegisterRequest, UpdateRefreshTokenRequest } from 'src/inteface/request/';
import { refreshTokenConfig } from './config';
import { AccountRepository } from 'src/repository';
import { JwtPayload } from 'src/inteface';
import { ITokenResponse, JwtResponse, RegisterResponse } from 'src/inteface/response';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthenticationService {
  constructor(
              private readonly _accountRepository : AccountRepository,
              @Inject(refreshTokenConfig.KEY) private readonly refeshTokenConfig: ConfigType<typeof refreshTokenConfig>,
              private readonly _jwtService: JwtService,
              private readonly _configService: ConfigService
  ){}
  async createAccount(data: CreateAccountRequest): Promise<Account>{
    data.password = await hash(data.password);
    const saveu = await this._accountRepository.save(data);
    return saveu;
  }
  async login(data: LoginRequest) : Promise<ITokenResponse> {
    const account = await this._accountRepository.findByEmail(data.email);
    if (account && await compare(data.password, account.password)) {
      const { accessToken, refreshToken } = await this.generateTokens(account.id, account.email);
      await this.updateRefreshToken({accountId: account.id, refreshToken: refreshToken});
      return { accessToken, refreshToken };
    }
    return null;
  }
  async findByEmail(email: string): Promise<Account | null> {
    return this._accountRepository.findByEmail(email);
  }
  async logout(id: string) {
    return this._accountRepository.update(id, { refreshToken: null });
  }
  async register(data: RegisterRequest){
    const hashedPassword = await hash(data.password);
    const account = await this._accountRepository.save({...data, password: hashedPassword});
    
    return plainToInstance(RegisterResponse,account);
  }

  async changePassword(id: string, data: ChangePasswordRequest){
    console.log(data);
    const account = await this._accountRepository.findOne(id);
    console.log(account);
    if (account && await compare(data.oldPassword, account.password)) {
      const hashedPassword = await hash(data.newPassword);
      console.log(hashedPassword);
      return this._accountRepository.update(id, { password: hashedPassword });
    }
  }

  async getAllAccounts(){
    return await this._accountRepository.find();
  }
    async refreshToken(refreshToken: string) : Promise<JwtResponse> {
    //try {
      const exPayload = await this._jwtService.verifyAsync(refreshToken, {
        secret: this._configService.get('REFRESH_TOKEN_SECRET'),
      });
      const account = await this._accountRepository.findOne(exPayload.sub);
      if (account && account.refreshToken === refreshToken) {
        const payload : JwtPayload = { sub: account.id , email: account.email};
        const token = await this._jwtService.sign(payload);
        return { accessToken: token };
      } 
    // } 
    // catch (error) {
    //   return null;
    // }
  }
  private async generateTokens(id: string, email: string): Promise<ITokenResponse> {
    const payload : JwtPayload = { sub: id , email: email};
    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.sign(payload),
      this._jwtService.sign(payload,this.refeshTokenConfig),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(data: UpdateRefreshTokenRequest): Promise<void> {
    await this._accountRepository.update(data.accountId, { refreshToken: data.refreshToken });
  }
}
