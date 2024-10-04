import { Inject, Injectable, Scope } from "@nestjs/common";
import { DataSource, DeepPartial, FindOptionsOrder, Like, Repository } from "typeorm";
import { BaseRepository } from "src/common/base-repository";
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Permission, RolePermissions, Roles } from "src/entity";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { RoleDTO } from "./dto/role.dto";
import { UpdateRoleDTO } from "./dto/request/update-role-request.dto";

@Injectable({ scope: Scope.REQUEST })
export class RoleRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }
    
    async find() {
        return await this.getRepository(Roles).find();
    }
    async findWithOptions(pageOptionsDto: PageOptionsDto,): Promise<[RoleDTO[],number]>{    
        const item = await this.getRepository(Roles).find({
            relations: ['rolePermissions', 'rolePermissions.permission'],
            take: pageOptionsDto.take,
            skip: pageOptionsDto.skip,
            where:{
                name : Like('%'+pageOptionsDto.searchKey+'%')
            }
        });
        const itemCount = (await this.getRepository(Roles).find({
            where:{
                name : Like('%'+pageOptionsDto.searchKey+'%')
            }
        })).length;
        return [item,itemCount]
    }

    async getRoleById(id: string) : Promise<Roles|null>{
        return await this.getRepository(Roles).findOne({ 
            where: { id : id}
        });
    }

    async save(data : DeepPartial<Roles>){
        return this.getRepository(Roles).save(data);
    }

    async delete(id: string){
        return this.getRepository(Roles).softDelete(id)
    }

    async updateRole(id: string, data: DeepPartial<Roles>){
        return this.getRepository(Roles).update(id,data);
    }
    
    async addPermissionToRole(roleId: string, permissionId: string) {
        const role = await this.getRepository(Roles).findOne({ 
            where: { id: roleId }
        });

        if (!role) {
            throw new Error('Role not found');
        }

        const permission = await this.getRepository(Permission).findOneBy({ 
            id: permissionId 
        });
        
        if (!permission) {
            throw new Error('Permission not found');
        }

        const newRolePermission = new RolePermissions();
        newRolePermission.role = role;
        newRolePermission.permission = permission;

        await this.getRepository(RolePermissions).save(newRolePermission);

        await this.getRepository(Roles).createQueryBuilder()
        .relation(Roles, "rolePermissions")
        .of(role)
        .add(newRolePermission);

    // Return a simplified role object without circular references
    return this.getRepository(Roles).findOne({
        where: { id: roleId },
        relations: ['rolePermissions', 'rolePermissions.permission'],
        select: ['id', 'name'] // Add other necessary fields
    });
    }
}
