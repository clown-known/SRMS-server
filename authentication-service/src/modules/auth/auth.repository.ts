import { ForbiddenException, Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { Account, Permission } from "src/entity";
import { AuthenticationCode } from "src/entity/authentication_code";
import { DataSource, MoreThan } from "typeorm";
import { AccountDTO } from "../account/dto/account.dto";
import { ConfirmAuthencodeRequest } from "./dto/request/confirm-authencode-request.dto";

@Injectable({scope: Scope.REQUEST})
export class AuthRepository extends BaseRepository {
    constructor(
        dataSource: DataSource, 
        @Inject(REQUEST) req: Request,
        config: ConfigService
        ) {
        super(dataSource, req);
    }
    async createAuthenCode(accountId: string){
        const code = this.genCode();
        const entity = {
            code: code,
            accountId: accountId,
            expiredTime: (Date.now() + 60 *5).toString()
        } 
        return await this.getRepository(AuthenticationCode).save(entity);
    }
    async confirmAuthenCode(code: string, accountId: string): Promise<boolean>{
        const entity = await this.getRepository(AuthenticationCode).findOne({
            where : {code: code, isUsed: false, accountId: accountId
            }
        });
        if(!entity) return false;
        if(Date.parse(entity.expiredTime)<Date.now()) return false;

        // await this.getRepository(AuthenticationCode).update(entity.id,{isUsed:true});
        return true;
    }
    async useAuthenCode(code: string, accountId: string): Promise<boolean>{
        const entity = await this.getRepository(AuthenticationCode).findOne({
            where : {code: code, isUsed: false, accountId: accountId
            }
        });
        console.log(entity)
        if(!entity) return false;
        console.log(Date.parse(entity.expiredTime)<Date.now())
        if(Date.parse(entity.expiredTime)<Date.now()) return false;
        await this.getRepository(AuthenticationCode).update(entity.id,{isUsed:true});
        return true;
    }
    private genCode() : string{
        return (Math.random() + 1).toString(36).substring(7);
    }
    // async getAllUsersWithPermission(permissionId: string): Promise<Account[]> {
    //     return this.getRepository(Account).query(
    //       `SELECT a.*
    //        FROM account a
    //        JOIN roles r ON a.roleid = r.id
    //        JOIN role_permissions rp ON r.id = rp.role_id
    //        WHERE rp.permission_id = $1`,
    //       [permissionId],
    //     );
    //   }
    async getPermissionsOfUser(id: string): Promise<Permission[]> {
        const user = await this.getRepository(Account).findOne({
            where: { id },
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.role) {
            return []
        }
        return user.role.rolePermissions.map(rp => rp.permission);
    }
}