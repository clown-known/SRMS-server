import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/entity/permission";
import { Repository } from "typeorm";
import { AccountRepository } from "./account.repository";
@Injectable()
export class PermissionRepository extends Repository<Permission> {
    constructor(
        @InjectRepository(Permission)
        private readonly repository: Repository<Permission>,
        private readonly accountRepository: AccountRepository
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
    async getPermissionsOfUser(id: string): Promise<Permission[]> {
        const user = await this.accountRepository.findOne({
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

