import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Roles } from "src/entity/role";
import { Repository } from "typeorm";
@Injectable()
export class RoleRepository extends Repository<Roles>{
    constructor(
        @InjectRepository(Roles)
        private readonly repository: Repository<Roles>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
}
