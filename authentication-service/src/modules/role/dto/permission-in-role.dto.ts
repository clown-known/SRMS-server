import { IsNotEmpty, IsString } from "class-validator";

export class PermissionInRoleDTO{
    //@IsString()
    //@IsNotEmpty()
    id: string;

    action?: string;
    module?:string
}