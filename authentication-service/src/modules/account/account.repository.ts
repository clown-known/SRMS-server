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
import { Profile } from "src/entity";
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
    async findWithOption(pageOptionsDto: PageOptionsDto,) : Promise<[AccountDTO[],itemCount: number]>{
        const order: FindOptionsOrder<Account> = {
            ...(pageOptionsDto.orderBy? { [pageOptionsDto.orderBy]: pageOptionsDto.order } : {}),
        }       
        const value = await this.getRepository(Account).find({
            relations: ['profile','role'],
            take: pageOptionsDto.take,
            order,
            skip: pageOptionsDto.skip,
            where:{
                email : Like('%'+pageOptionsDto.searchKey+'%')
            }
        });
        const queryBuilder = this.getRepository(Account).createQueryBuilder("account")
        queryBuilder
            .orderBy(pageOptionsDto.orderBy? { [pageOptionsDto.orderBy]: pageOptionsDto.order } : {})
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);

        const itemCount = await queryBuilder.getCount();
        return [transformToDTO(AccountDTO,value),itemCount];
    }
    async findByEmail(email: string): Promise<AccountDTO | null> {
        const value = await this.getRepository(Account).findOne({ relations: ['profile'] ,where: { email } });
        return plainToInstance(AccountDTO,value);
    }
    async findOne(id : string) : Promise<Account | null>{
        return await this.getRepository(Account).findOne({relations: ['profile','role'] , where: { id } });
    }
    async update(id: string,data : DeepPartial<Account>): Promise<AccountDTO | null>{
        if(!this.findOne(id)) throw new BadRequestException(' object not found!');
        const updated = await this.getRepository(Account).update(id,data);
        return transformToDTO(AccountDTO,updated)
    }
    async halfUpdate(id:string,data : DeepPartial<Account>){
        if(!this.findOne(id)) throw new BadRequestException(' object not found!');
        const updated = await this.getRepository(Account).update(id,data);
        return transformToDTO(AccountDTO,updated)
    }
    async save(data : DeepPartial<Account>){
        if(!this.findByEmail(data.email)) throw new BadRequestException(' email is already exist!');
        const saved = await this.getRepository(Account).save(data);
        return transformToDTO(AccountDTO,saved);
    }
    async haftSave(data : DeepPartial<Account>){
        if(!this.findByEmail(data.email)) throw new BadRequestException(' email is already exist!');
        const saved = await this.getRepository(Account).save(data);
        console.log(saved)
        return saved
    }

    async delete(id: string){
        if(!this.findOne(id)) throw new BadRequestException(' object not found!');
        return this.getRepository(Account).softDelete(id);
    }
}
