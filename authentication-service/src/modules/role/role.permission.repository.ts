import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { Permission, Roles } from "src/entity";
import { RolePermissions } from "src/entity/role.permissions";
import { DataSource } from "typeorm";

@Injectable({ scope: Scope.REQUEST })
export class RolePermissionRepository extends BaseRepository {
    constructor(
        dataSource: DataSource, @Inject(REQUEST) req: Request
    ) {
        super(dataSource, req);
    }


    async addPermissionToRole(role: Roles, permissions: Permission[]) {

        const items = permissions.map((e) => {
            return {
                role: role,
                permission: e,
            } as RolePermissions;
        });

        await this.getRepository(RolePermissions).insert(items);

        await this.getRepository(Roles).createQueryBuilder()
        .relation(Roles, "rolePermissions")
        .of(role)
        .add(items);

    // Return a simplified role object without circular references
    return this.getRepository(Roles).findOne({
        where: { id: role.id },
        relations: ['rolePermissions', 'rolePermissions.permission'],
        select: ['id', 'name'] // Add other necessary fields
    });
    }
}
