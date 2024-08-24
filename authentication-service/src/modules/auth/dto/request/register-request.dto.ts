import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterRequest {
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
  @IsNotEmpty()
  phoneNumber: string;
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsNotEmpty()
  dateOfBirth: Date;
}