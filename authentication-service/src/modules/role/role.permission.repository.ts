import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { Permission, Roles } from "src/entity";
import { RolePermissions } from "src/entity/role.permissions";
import { DataSource } from "typeorm";
import { PermissionDTO } from "../permission/dto/permission.dto";

@Injectable({ scope: Scope.REQUEST })
export class RolePermissionRepository extends BaseRepository {
    constructor(
        dataSource: DataSource, @Inject(REQUEST) req: Request
    ) {
        super(dataSource, req);
    }
    async test(){
        const role = await this.getRepository(Roles).findOne({where: {id:'daec956a-84a7-41e9-9213-ecea1380b9da'}});
        const permission = await this.getRepository(Permission).findOne({where: {id:'f69c21d1-9ace-4836-afe1-8cb88b1d81ee'}});
        await this.getRepository(RolePermissions).save({permission: permission,role: role})
    }
    async deletePermissionOfRole(roleId:string,permissionId :string) {
        const result = await this.getRepository(RolePermissions).delete({ role: { id: roleId }, permission: { id: permissionId } });
        if (result.affected === 0) {
            console.log('No permission found to delete.');
        }
    }
    async updatePermissionToRole(role: Roles, permissions: Permission[]){
        await this.getRepository(RolePermissions).delete({ role: role });

        // Prepare new permission items
        const items = permissions.map((e) => {
            return {
                role: role,
                permission: e,
            } as RolePermissions;
        });

        // Insert new permissions
        await this.getRepository(RolePermissions).insert(items);
        
        // Return the updated role object
        return this.getRepository(Roles).findOne({
            where: { id: role.id },
            relations: ['rolePermissions', 'rolePermissions.permission'],
            select: ['id', 'name'] // Add other necessary fields
        });
    }
    async addPermissionToRole(role: Roles, permissions: PermissionDTO[]) {
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
