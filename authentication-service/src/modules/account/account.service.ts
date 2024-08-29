import { Inject, Injectable, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/entity/account';
import { ConfigService, ConfigType } from '@nestjs/config';
import { compare } from 'bcrypt';
import { hash } from '../../common/security';

import { refreshTokenConfig } from '../../config';
import { plainToInstance } from 'class-transformer';
import { AccountRepository } from './account.repository';
import { CreateAccountRequest } from './dto/request/create-account.dto';
import { LoginRequest } from './dto/request/login-request.dto';
import { ITokenResponse } from './dto/token.interface';
import { RegisterRequest } from './dto/request/register-request.dto';
import { ChangePasswordRequest } from './dto/request/change-password-request.dto';
import { RegisterResponse } from './dto/response/register-response.dto';
import { JwtResponse } from './dto/response/jwt-response.dto';
import { JwtPayload } from 'src/inteface/jwt.payload';
import { UpdateRefreshTokenRequest } from './dto/request/update-refresh-token-request.dto';
import { DeepPartial } from 'typeorm';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { PageMetaDto } from 'src/common/pagination/page-meta.dto';
import { PageDto } from 'src/common/pagination/page.dto';
import { AccountDTO } from './dto/account.dto';

@Injectable()
export class AccountService {
  
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
  async findByEmail(email: string): Promise<Account | null> {
    return this._accountRepository.findByEmail(email);
  }
  async findById(id: string): Promise<Account | null> {
    console.log(await this._accountRepository.findOne(id));
    return await this._accountRepository.findOne(id);
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

  async getAllAccounts(pageOptionsDto: PageOptionsDto,) : Promise<PageDto<AccountDTO>>{
    const items = await this._accountRepository.findWithOption(pageOptionsDto);
    const pageMetaDto = new PageMetaDto({ itemCount : items.length, pageOptionsDto });
    return new PageDto(items, pageMetaDto);
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
  public async haftSave(data: DeepPartial<Account>){
    return this._accountRepository.save(data);
  }
  public async haftUpdate(id: string, data: DeepPartial<Account>){
    return this._accountRepository.update(id,data);
  }
  public async updateRefreshToken(id: string, token: string): Promise<void> {
    await this._accountRepository.update(id, { refreshToken: token });
  }
}
