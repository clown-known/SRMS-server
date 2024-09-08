import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account";

@Entity()
export class AuthenticationCode{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column({
        default: false
    })
    isUsed: boolean;

    @Column()
    accountId: string;
    
    @ManyToOne(() => Account, account => account)
    account: Account;
}