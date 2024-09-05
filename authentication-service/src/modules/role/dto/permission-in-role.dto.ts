import { Expose } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class PermissionInRoleDTO{
    //@IsString()
    //@IsNotEmpty()
    @Expose()
    id: string;
    @Expose()
    action?: string;
    @Expose()
    module?:string
}