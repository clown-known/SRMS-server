import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { Account, Permission } from "src/entity";
import { DataSource } from "typeorm";

@Injectable({scope: Scope.REQUEST})
export class AuthRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
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