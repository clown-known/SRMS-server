import { Injectable } from "@nestjs/common";
import { Account } from "src/entity/account";
import { Repository } from "typeorm";
@Injectable()
export class AccountRepository extends Repository<Account>{
  
}