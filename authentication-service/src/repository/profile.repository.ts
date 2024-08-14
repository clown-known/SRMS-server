import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Profile } from "src/entity/profile";
import { Repository } from "typeorm";
@Injectable()
export class ProfileRepository extends Repository<Profile>{
    constructor(
        @InjectRepository(Profile)
        private readonly repository: Repository<Profile>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
}
