import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Roles } from "src/entity/role";
import { CreateRoleRequestDto } from "src/modules/role/dto/request/create-role-request.dto";
import { UpdateRoleDTO } from "src/modules/role/dto/request/update-role-request.dto";
import { DataSource } from "typeorm";
import { RoleRepository } from "./role.repository";
import { AddPermissionToRoleRequestDto } from "./dto/request/add-permission-request.dto";
@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository,
        private dataSource: DataSource
    ){}

    // async createRole(role: CreateRoleRequestDto): Promise<RoleDTO> {
    //     const queryRunner = this.dataSource.createQueryRunner();
    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();
    //     try{
    //         const saved = await this.roleRepository.save(role);
    //         role.permissions.forEach(permission => {
    //             this.roleRepository.addPermissionToRole(saved.id,permission.id);
    //         });
    //         return plainToInstance(RoleDTO,saved);
    //     }catch (error){
    //         // rollback
    //         // code 
    //         // xong throw 
    //         throw new HttpException(
    //             { message: 'Transaction failed, rolling back.' },
    //             HttpStatus.BAD_REQUEST
    //           );
    //     }  
    // }

    async addPermissionToRole(permission: AddPermissionToRoleRequestDto): Promise<Roles> {
        return await this.roleRepository.addPermissionToRole(permission.roleId, permission.permissionId);
    }

    async updateRole(id: string,role: UpdateRoleDTO){

    }
}