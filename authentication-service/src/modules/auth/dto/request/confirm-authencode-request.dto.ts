import { IsNotEmpty, IsString } from "class-validator";

export class ConfirmAuthencodeRequest{
    @IsString()
    @IsNotEmpty()
    code: string;
    email: string;
}