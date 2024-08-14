import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/entity/permission";
import { Repository } from "typeorm";
@Injectable()
export class PermissionRepository extends Repository<Permission> {
    constructor(
        @InjectRepository(Permission)
        private readonly repository: Repository<Permission>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
}

