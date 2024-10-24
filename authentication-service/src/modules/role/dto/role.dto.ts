import { Expose, Type } from "class-transformer";
import { PermissionInRoleDTO } from "./permission-in-role.dto";

export class RoleDTO{
    @Expose()
    id: string;
    @Expose()
    name: string;
    @Expose()
    isAdmin?: boolean;
    @Expose()
    @Type(()=>PermissionInRoleDTO)
    permissionsInRole?: PermissionInRoleDTO[]
}