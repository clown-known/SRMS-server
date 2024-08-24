import { Injectable, UseInterceptors } from "@nestjs/common";
import { Roles } from "src/entity/role";
import { CreateRoleRequestDto } from "src/modules/role/dto/request/create-role-request.dto";
import { UpdateRoleDTO } from "src/modules/role/dto/request/update-role-request.dto";
import { DataSource } from "typeorm";
import { RoleRepository } from "./role.repository";
import { AddPermissionToRoleRequestDto } from "./dto/request/add-permission-request.dto";
import { PermissionService } from "../permission/permission.service";
import { RolePermissionRepository } from "./role.permission.repository";
import { RoleDTO } from "./dto/role.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository,
        private readonly permissionService: PermissionService,
        private readonly rolePermissionRepository: RolePermissionRepository, 
        private dataSource: DataSource
    ){}
    
    async createRole(role: CreateRoleRequestDto): Promise<RoleDTO> {
        const saved = await this.roleRepository.save(role);
        const permissions = await this.permissionService.getPermissions(role.permissions.map(e=>{return e.id as string}));
        const result = this.rolePermissionRepository.addPermissionToRole(saved,permissions);
        return plainToInstance(RoleDTO,result);
    }  
    

    async addPermissionToRole(permission: AddPermissionToRoleRequestDto): Promise<Roles> {
        return await this.roleRepository.addPermissionToRole(permission.roleId, permission.permissionId);
    }

    async updateRole(id: string,role: UpdateRoleDTO){

    }
}