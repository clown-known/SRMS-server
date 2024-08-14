import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/entity/role";
import { RolePermissions } from "src/entity/role.permissions";
import { Repository } from "typeorm";
import { RolePermissionRepository } from "./role.permission.repository";
import { PermissionRepository } from "./permission.repository";
@Injectable()
export class RoleRepository extends Repository<Roles>{
    constructor(
        @InjectRepository(Roles)
        private readonly repository: Repository<Roles>,
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly permissionRepository: PermissionRepository
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
    async addPermissionToRole(roleId: string, permissionId: string) {
        const role = await this.repository.findOne({ 
            where: { id: roleId }
        });

        if (!role) {
            throw new Error('Role not found');
        }

        const permission = await this.permissionRepository.findOneBy({ 
            id: permissionId 
        });
        
        if (!permission) {
            throw new Error('Permission not found');
        }

        const newRolePermission = new RolePermissions();
        newRolePermission.role = role;
        newRolePermission.permission = permission;

        await this.rolePermissionRepository.save(newRolePermission);

        await this.repository.createQueryBuilder()
        .relation(Roles, "rolePermissions")
        .of(role)
        .add(newRolePermission);

    // Return a simplified role object without circular references
    return this.repository.findOne({
        where: { id: roleId },
        relations: ['rolePermissions', 'rolePermissions.permission'],
        select: ['id', 'name'] // Add other necessary fields
    });
    }
}
