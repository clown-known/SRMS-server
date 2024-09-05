import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account";

@Entity()
export class AuthenticationCode{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column()
    accountId: string;
    
    @Column()
    isUsed: boolean;

    @ManyToOne(() => Account, account => account)
    accounts: Account;
}