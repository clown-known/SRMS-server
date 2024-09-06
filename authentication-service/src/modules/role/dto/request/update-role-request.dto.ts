import { PermissionInRoleDTO } from "../permission-in-role.dto";

export class UpdateRoleDTO{
    //@IsString()
    //@IsNotEmpty()
    name: string;

    permissionIds: string[]
    //@IsNotEmptyObject()
    permissions?: PermissionInRoleDTO[]
}