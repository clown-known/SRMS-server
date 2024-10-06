import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateAccountRequest{
  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  roleId?: string;
}