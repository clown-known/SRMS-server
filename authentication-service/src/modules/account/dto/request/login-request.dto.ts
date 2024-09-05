import { IsNotEmpty, IsString } from "class-validator";

export class LoginRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}