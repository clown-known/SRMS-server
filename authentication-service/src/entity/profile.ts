import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account";
import { BaseEntity } from "src/common/base.entity";

@Entity()
export class Profile extends BaseEntity{
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phoneNumber: string;

    @Column()
    address: string;

    @Column()
    dateOfBirth: Date;

    @Column({
        nullable:true
    })
    accountId?: string;

    @OneToOne(() => Account, account => account.profile)
    account: Account;
}
