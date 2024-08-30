import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { Account } from "src/entity/account";
import { DataSource, DeepPartial, FindOptionsOrder, FindOptionsWhere, Like} from "typeorm";
import { AccountDTO } from "./dto/account.dto";
import { transformToDTO } from "src/common/transform.util";
import { plainToInstance } from "class-transformer";
@Injectable({scope: Scope.REQUEST})
export class AccountRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }
    async find(){
        return await this.getRepository(Account).find({
            relations: ['profile'],
        });
    }
    async findWithOption(pageOptionsDto: PageOptionsDto,) : Promise<AccountDTO[]>{
        const order: FindOptionsOrder<Account> = {
            ...(pageOptionsDto.orderBy? { [pageOptionsDto.orderBy]: pageOptionsDto.order } : {}),
        }       
        const value = await this.getRepository(Account).find({
            relations: ['profile'],
            take: pageOptionsDto.take,
            order,
            skip: pageOptionsDto.skip,
            where:{
                email : Like('%'+pageOptionsDto.searchKey+'%')
            }
        });
        return transformToDTO(AccountDTO,value);
    }
    async findByEmail(email: string): Promise<AccountDTO | null> {
        const value = await this.getRepository(Account).findOne({ relations: ['profile'] ,where: { email } });
        return plainToInstance(AccountDTO,value);
    }
    async findOne(id : string) : Promise<AccountDTO | null>{
        const value = await this.getRepository(Account).findOne({ where: { id } });
        return transformToDTO(AccountDTO,value);
    }
    async update(id: string,data : DeepPartial<Account>): Promise<AccountDTO | null>{
        if(!this.findOne(id)) throw new BadRequestException(' object not found!');
        const updated = await this.getRepository(Account).update(id,data);
        return transformToDTO(AccountDTO,updated)
    }
    async save(data : DeepPartial<Account>){
        if(!this.findByEmail(data.email)) throw new BadRequestException(' email is already exist!');
        const saved = await this.getRepository(Account).save(data);
        return transformToDTO(AccountDTO,saved);
    }
}
