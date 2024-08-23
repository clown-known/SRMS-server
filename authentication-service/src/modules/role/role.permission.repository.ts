import { InjectRepository } from "@nestjs/typeorm";
import { RolePermissions } from "src/entity/role.permissions";
import { Repository } from "typeorm";

export class RolePermissionRepository extends Repository<RolePermissions> {
    constructor(
        @InjectRepository(RolePermissions)
        private readonly repository: Repository<RolePermissions>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
}
