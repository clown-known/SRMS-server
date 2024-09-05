import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePermissionRequestDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    module: string;

    @IsString()
    @IsNotEmpty()
    action: string;
}