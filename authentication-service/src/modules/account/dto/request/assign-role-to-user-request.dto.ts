import { IsNotEmpty, IsString } from "class-validator";

export class AssignRoleToUserRequest {

    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    roleId: string;
}