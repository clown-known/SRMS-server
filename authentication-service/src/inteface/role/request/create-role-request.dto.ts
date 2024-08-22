import { IsNotEmpty, IsNotEmptyObject, IsString } from "class-validator";
import { PermissionInRoleDTO } from "../permission-in-role.dto";

export class CreateRoleRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmptyObject()
    permissions: PermissionInRoleDTO[]
}