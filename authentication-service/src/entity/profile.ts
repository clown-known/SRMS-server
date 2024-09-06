import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
