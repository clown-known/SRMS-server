import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission";
import { Account } from "./account";
import { RolePermissions } from "./role.permissions";

@Entity("roles")
export class Roles extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({nullable:true,default:false})
    isAdmin?: boolean;

    @OneToMany(() => RolePermissions, rolePermission => rolePermission.role)
    rolePermissions: RolePermissions[];

    @OneToMany(() => Account, account => account)
    accounts: Account[];
}