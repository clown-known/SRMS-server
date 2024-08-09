import { Injectable, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from 'src/entity/account';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { hash } from './security';
import { CreateAccountRequest, LoginRequest, RegisterRequest } from 'src/inteface/request/';

@Injectable()
export class AuthenticationService {
  constructor(
              @InjectRepository(Account) private readonly _accountRepository : Repository<Account>,
              private readonly _jwtService: JwtService,
              private readonly _configService: ConfigService
  ){}
  async createAccount(data: CreateAccountRequest): Promise<Account>{
    data.password = await hash(data.password);
    const saveu = await this._accountRepository.save(data);
    return saveu;
  }
  async login(data: LoginRequest) {
    const account = await this._accountRepository.findOne({ where: { email: data.email } });
    if (account && await compare(data.password, account.password)) {
      const { accessToken, refreshToken } = await this.generateTokens(account.id, account.email);
      await this.updateRefreshToken(account.id, refreshToken);
      return { accessToken, refreshToken };
    }
    return null;
  }
  async logout(id: string) {
    return this._accountRepository.update(id, { refreshToken: null });
  }
  async register(data: RegisterRequest){
    const hashedPassword = await hash(data.password);
    const account = await this._accountRepository.save({...data, password: hashedPassword});
    return account;
  }
  async getAllAccounts(){
    return await this._accountRepository.find();
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = await this._jwtService.verifyAsync(refreshToken, {
        secret: this._configService.get('REFRESH_TOKEN_SECRET'),
      });
      const account = await this._accountRepository.findOne({ where: { id: payload.sub } });
      if (account && account.refreshToken === refreshToken) {
        const tokens = await this.generateTokens(account.id, account.email);
        await this.updateRefreshToken(account.id, tokens.refreshToken);
        return tokens;
      }
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
  private async generateTokens(id: string, email: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: id , email: email};
    const [accessToken, refreshToken] = await Promise.all([
      this._jwtService.signAsync(payload, {
        secret: this._configService.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this._jwtService.signAsync(payload, {
        secret: this._configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateRefreshToken(accountId: string, refreshToken: string): Promise<void> {
    await this._accountRepository.update(accountId, { refreshToken });
  }
}
