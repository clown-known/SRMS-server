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
import { RoleService } from '../role/role.service';
import { KafkaService } from '../kafka/kafka.service';
import { transformToDTO } from 'src/common/transform.util';
import { UpdateAccountRequest } from './dto/request';

@Injectable()
export class AccountService {
  constructor(
              private readonly _accountRepository : AccountRepository,
              private readonly _profileService : ProfileService,
              private readonly _roleService : RoleService,
              private readonly kafkaService: KafkaService,
  ){}
  async createAccount(data: CreateAccountRequest): Promise<AccountDTO>{
    if(await this._accountRepository.findByEmail(data.email)!=null) throw new BadRequestException('email aready exist!');
    if(data.roleId != null && await this._roleService.getById(data.roleId)==null) throw new BadRequestException('role doesnot exist!');
    const hashedPassword = await hash(data.password);
    const profile = await this._profileService.createProfile({
      firstName: data.firstName,
      lastName: data.lastName,
    });
    const role = await this._roleService.getById(data.roleId);
    const account = await this._accountRepository.haftSave({
      email:data.email, 
      password: hashedPassword,
      profileId: profile.id,
      profile:profile,
      roleId:role.id,
      role:role
    });
    await this._profileService.haftUpdate(profile.id,{
      accountId: account.id
    } )
    await this.kafkaService.emitCreateAccount(data.email, data.firstName);

    return transformToDTO( AccountDTO,await this.findByEmail(data.email));
  }

  async updateAccountWithRole(id: string, data: UpdateAccountRequest): Promise<AccountDTO>{
    const account = await this._accountRepository.findOne(id)
    if(account == null) throw new BadRequestException('email doesnot exist!');
    if(data.roleId == null || data.roleId == '' && account.roleId != null) this._accountRepository.halfUpdate(id,{role:null,roleId:null})
    if(data.roleId != null && await this._roleService.getById(data.roleId)==null) throw new BadRequestException('role doesnot exist!');
    // const hashedPassword = await hash(data.password);
    const profile = await this._profileService.haftUpdate(account.profileId,{
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      phoneNumber: data.phoneNumber
    });
    const role = await this._roleService.getById(data.roleId);
    const result = await this._accountRepository.update(id,{
      email:data.email, 
      profile:profile,
      roleId:role.id,
      role:role
    });
    // await this.kafkaService.emitRegisterEmail(data.email, data.firstName);
    return transformToDTO( AccountDTO,await this.findByEmail(data.email));
  }
  async updateAccount(id: string, data: UpdateAccountRequest): Promise<AccountDTO>{
    const account = await this._accountRepository.findOne(id)
    if(account==null) throw new BadRequestException('email doesnot exist!');
    // const hashedPassword = await hash(data.password);
    const profile = await this._profileService.haftUpdate(account.profileId,{
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      phoneNumber: data.phoneNumber
    });
    const result = await this._accountRepository.update(id,{
      email:data.email, 
      profile:profile,
    });
    // await this.kafkaService.emitRegisterEmail(data.email, data.firstName);
    return transformToDTO( AccountDTO,await this.findByEmail(data.email));
  }

  async findByEmail(email: string): Promise<AccountDTO | null> {
    return await this._accountRepository.findByEmail(email);
  }
  async findById(id: string): Promise<Account | null> {
    return await this._accountRepository.findOne(id);
  }
  async changePassword(id: string, data: ChangePasswordRequest){
    const account = await this._accountRepository.findOne(id);
    if(!account) throw new BadRequestException('Account was not found!');
    if (!(await compare(data.oldPassword, account.password))) {
      throw new BadRequestException('old password is not match!');
    }
    const hashedPassword = await hash(data.newPassword);
    return this._accountRepository.update(id, { password: hashedPassword });
  }

  async resetPassword(id: string){
    const account = await this._accountRepository.findOne(id);
    if(!account) throw new BadRequestException('Account was not found!');
    const newPass = this.makePass(7);
    const hashedPassword = await hash(newPass);
    this._accountRepository.update(id, { password: hashedPassword });

    // kafka
    await this.kafkaService.emitResetPasswordEmail(account.email, newPass);

  }

  async getAllAccounts(pageOptionsDto: PageOptionsDto,) : Promise<PageDto<AccountDTO>>{
    const [items,count] = await this._accountRepository.findWithOption(pageOptionsDto);
    const pageMetaDto = new PageMetaDto({ itemCount : count, pageOptionsDto });
    return new PageDto(items, pageMetaDto);
  }

  public async haftSave(data: DeepPartial<Account>){
    return this._accountRepository.haftSave(data);
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

  public async assignRole(id:string, roleId:string){
    const role = await this._roleService.getById(roleId)
    const account = await this._accountRepository.findOne(id);
    if(!role||!account) throw new BadRequestException('role does not exist!');
    return this._accountRepository.update(id,{roleId: role.id,role:role})
  }
  makePass(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

}
