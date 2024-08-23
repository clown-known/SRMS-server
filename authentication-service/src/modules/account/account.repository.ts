import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { Account } from "src/entity/account";
import { DataSource, DeepPartial, FindOptionsWhere} from "typeorm";
@Injectable({scope: Scope.REQUEST})
export class AccountRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }
    async find(){
        return this.getRepository(Account).find();
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
