import { Injectable } from "@nestjs/common";
import { Roles } from "src/entity/role";
import { AddPermissionToRoleRequestDto } from "src/inteface/request/add-permission-request.dto";
import { CreateRoleRequestDto } from "src/inteface/role/request/create-role-request.dto";
import { RoleRepository } from "src/repository/role.repository";
@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) 
  {}
    async createRole(role: CreateRoleRequestDto): Promise<Roles> {
        console.log(role);
        return await this.roleRepository.save(role);
    }
    async addPermissionToRole(permission: AddPermissionToRoleRequestDto): Promise<Roles> {
        return await this.roleRepository.addPermissionToRole(permission.roleId, permission.permissionId);
    }
}