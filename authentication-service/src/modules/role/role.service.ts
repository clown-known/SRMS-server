import { BadRequestException, Injectable, UseInterceptors } from "@nestjs/common";
import { Roles } from "src/entity/role";
import { CreateRoleRequestDto } from "src/modules/role/dto/request/create-role-request.dto";
import { UpdateRoleDTO } from "src/modules/role/dto/request/update-role-request.dto";
import { DataSource } from "typeorm";
import { RoleRepository } from "./role.repository";
import { AddPermissionToRoleRequestDto } from "./dto/request/add-permission-request.dto";
import { PermissionService } from "../permission/permission.service";
import { RolePermissionRepository } from "./role.permission.repository";
import { RoleDTO } from "./dto/role.dto";
import { transformToDTO } from "src/common/transform.util";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";
import { PageDto } from "src/common/pagination/page.dto";

@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository,
        private readonly permissionService: PermissionService,
        private readonly rolePermissionRepository: RolePermissionRepository, 
        private dataSource: DataSource
    ){}
    async getAll( pageOptionsDto: PageOptionsDto){
        const [items,itemCount] = await this.roleRepository.findWithOptions(pageOptionsDto);
        const pageMetaDto = new PageMetaDto({ itemCount : itemCount, pageOptionsDto });
        return new PageDto(items, pageMetaDto);
    }
    async getById(id: string){
        return transformToDTO(RoleDTO,await this.roleRepository.getRoleById(id));
    }
    async createRole(role: CreateRoleRequestDto): Promise<RoleDTO> {
        const saved = await this.roleRepository.save(role);
        const permissions = await this.permissionService.getPermissions(role.permissions.map(e=>{return e.id as string}));
        const result = this.rolePermissionRepository.addPermissionToRole(saved,permissions);
        return transformToDTO(RoleDTO,result);
    }  
    
    async addPermissionToRole(permission: AddPermissionToRoleRequestDto): Promise<Roles> {
        return await this.roleRepository.addPermissionToRole(permission.roleId, permission.permissionId);
    }

    async updateRole(id: string, data: UpdateRoleDTO){
        const entity = await this.roleRepository.getRoleById(id);
        if(!entity) throw new BadRequestException('Role was not found!');
        await this.rolePermissionRepository.deletePermissionOfRoleByRoleId(id);
        await this.roleRepository.updateRole(id,{name: data.name});
        const permissions = await this.permissionService.getPermissions(data.permissions.map(e=>{return e.id as string}));
        console.log(permissions)
        const updatedEntity = await this.roleRepository.getRoleById(id);
        const result = this.rolePermissionRepository.addPermissionToRole(updatedEntity,permissions);

        return result
    }

    async deletePermissionOfRole(roleId: string,permisisonId : string){
        return this.rolePermissionRepository.deletePermissionOfRole(roleId,permisisonId);
    }

    async delete(roleId: string){
        if(!this.getById(roleId)) throw new BadRequestException(' Role was not found!')
        await this.rolePermissionRepository.deletePermissionOfRoleByRoleId(roleId);
        return await this.roleRepository.delete(roleId);
    }
}