import { Inject, Injectable, Scope } from "@nestjs/common";
import { Permission } from "src/entity/permission";
import { DataSource, In, Repository } from "typeorm";
import { BaseRepository } from "src/common/base-repository";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Account } from "src/entity/account";
import { CreatePermissionRequestDto } from "./dto";

@Injectable({scope: Scope.REQUEST})
export class PermissionRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

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
    
    async softDelete(id: string){
        return this.getRepository(Permission).softDelete(id);
    }
    async update(id: string, data: CreatePermissionRequestDto){
        return this.getRepository(Permission).update(id,data);
    }

    async save(data:CreatePermissionRequestDto){
        return this.getRepository(Permission).save(data);
    }

    async findOne(id: string){
        return this.getRepository(Permission).findOne({ where: { id } });
    }

    async find(ids?: string[]): Promise<Permission[]> {
        if (ids && ids.length > 0) {
            return this.getRepository(Permission).findBy({
                id: In(ids)
            });
        }
        return this.getRepository(Permission).find();
    }
}

