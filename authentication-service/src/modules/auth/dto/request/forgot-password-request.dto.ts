import { IsNotEmpty } from "class-validator";

export class ForgotPasswordRequest{
    @IsNotEmpty()
    email: string;
}