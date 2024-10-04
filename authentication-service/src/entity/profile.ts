import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account";
import { BaseEntity } from "src/common/base.entity";

@Entity()
export class Profile extends BaseEntity{
    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({
        nullable:true
    })
    phoneNumber: string;

    @Column({
        nullable:true
    })
    address: string;

    @Column({
        nullable:true
    })
    dateOfBirth: Date;

    @Column({
        nullable:true
    })
    accountId?: string;

    @OneToOne(() => Account, account => account.profile)
    account: Account;
}
