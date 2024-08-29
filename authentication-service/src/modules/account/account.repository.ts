import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { Permission } from "src/entity";
import { Account } from "src/entity/account";
import { DataSource, DeepPartial, FindOptionsOrder, FindOptionsWhere, Like} from "typeorm";
import { AccountDTO } from "./dto/account.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { plainToInstance } from "class-transformer";
import { transformToDTO } from "src/common/transform.util";
@Injectable({scope: Scope.REQUEST})
export class AccountRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }
    async find(){
        return this.getRepository(Account).find({
            relations: ['profile'],
        });
    }
    async findWithOption(pageOptionsDto: PageOptionsDto,) : Promise<AccountDTO[]>{
        const order: FindOptionsOrder<Account> = {
            ...(pageOptionsDto.orderBy? { [pageOptionsDto.orderBy]: pageOptionsDto.order } : {}),
        }       
        const result = await this.getRepository(Account).find({
            relations: ['profile'],
            take: pageOptionsDto.take,
            order,
            skip: pageOptionsDto.skip,
            where:{
                email : Like('%'+pageOptionsDto.searchKey+'%')
            }
        });
        return transformToDTO(AccountDTO,result);
    }
    async findByEmail(email: string): Promise<Account | null> {
        return this.getRepository(Account).findOne({ where: { email } });
    }
    async findOne(id : string) : Promise<Account | null>{
        return this.getRepository(Account).findOne({ where: { id } });
    }
    async update(id: string,data : DeepPartial<Account>){
        return this.getRepository(Account).update(id,data);
    }
    async save(data : DeepPartial<Account>){
        return this.getRepository(Account).save(data);
    }
}
