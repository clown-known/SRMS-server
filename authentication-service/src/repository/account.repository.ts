import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "src/entity/account";
import { Repository } from "typeorm";
@Injectable()
export class AccountRepository extends Repository<Account>{
    constructor(
        @InjectRepository(Account)
        private readonly repository: Repository<Account>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
    
    async findByEmail(email: string): Promise<Account | null> {
        return this.repository.findOne({ where: { email } });
    }
}
