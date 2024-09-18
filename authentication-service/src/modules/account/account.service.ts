import { BadRequestException, Injectable } from '@nestjs/common';
import { Account } from 'src/entity/account';
import { compare } from 'bcrypt';
import { hash } from '../../common/security';
import { AccountRepository } from './account.repository';
import { CreateAccountRequest } from './dto/request/create-account.dto';
import { ChangePasswordRequest } from './dto/request/change-password-request.dto';
import { DeepPartial } from 'typeorm';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { PageMetaDto } from 'src/common/pagination/page-meta.dto';
import { PageDto } from 'src/common/pagination/page.dto';
import { AccountDTO } from './dto/account.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AccountService {
  constructor(
              private readonly _accountRepository : AccountRepository,
              private readonly _profileService : ProfileService,
  ){}
  async createAccount(data: CreateAccountRequest): Promise<AccountDTO>{
    data.password = await hash(data.password);
    const saveu = await this._accountRepository.save(data);
    return saveu;
  }
  async findByEmail(email: string): Promise<AccountDTO | null> {
    return await this._accountRepository.findByEmail(email);
  }
  async findById(id: string): Promise<Account | null> {
    return await this._accountRepository.findOne(id);
  }
  async changePassword(id: string, data: ChangePasswordRequest){
    const account = await this._accountRepository.findOne(id);
    if(account) throw new BadRequestException('Account was not found!');
    if (!(await compare(data.oldPassword, account.password))) {
      throw new BadRequestException('old password is not match!');
    }
    const hashedPassword = await hash(data.newPassword);
    return this._accountRepository.update(id, { password: hashedPassword });
  }
  async getAllAccounts(pageOptionsDto: PageOptionsDto,) : Promise<PageDto<AccountDTO>>{
    const [items,count] = await this._accountRepository.findWithOption(pageOptionsDto);
    const pageMetaDto = new PageMetaDto({ itemCount : count, pageOptionsDto });
    return new PageDto(items, pageMetaDto);
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
  public async softDelete(id: string){
    const entity = await this._accountRepository.findOne(id);
    await this._profileService.deleteProfile(entity.profileId),
    await this._accountRepository.delete(id);
  }
}
