import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission";
import { Account } from "./account";

@Entity()
export class Roles extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => Permission, permission => permission)
    permissions: Permission[];

    @OneToMany(() => Account, account => account)
    accounts: Account[];
}