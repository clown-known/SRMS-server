import { permission } from "process";
import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./role";

@Entity()
export class Permission extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @ManyToOne(() => Roles, roles => roles.permissions)
    role :Roles;
}