import { PermissionInRoleDTO } from "./permission-in-role.dto";

export class RoleDTO{
    id: string;
    name: string;
    permissionsInRole: PermissionInRoleDTO[]
}