import { BeforeRemove, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "./role";
import { Permission } from "./permission";

@Entity()
export class RolePermissions {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => Roles, role => role.rolePermissions)
    @JoinColumn({ name: "role_id" })
    role: Roles;

    @ManyToOne(() => Permission, permission => permission.rolePermissions)
    @JoinColumn({ name: "permission_id" })
    permission: Permission;
}