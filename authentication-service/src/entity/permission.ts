import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolePermissions } from "./role.permissions";

@Entity("permissions")
export class Permission extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    module: string;

    @Column()
    action: string;

    @OneToMany(() => RolePermissions, rolePermission => rolePermission.permission)
    rolePermissions: RolePermissions[];
}