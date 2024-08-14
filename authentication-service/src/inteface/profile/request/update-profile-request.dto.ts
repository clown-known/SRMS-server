import { IsNotEmpty, IsString } from "class-validator";

export class UpdateProfileRequest {
    @IsString()
    @IsNotEmpty()
    accountId: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    address: string;
 
    @IsString()
    @IsNotEmpty()
    dateOfBirth: Date;
}