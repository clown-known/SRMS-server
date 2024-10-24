import { IsDate, IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateAccountWithoutRoleRequest {

//   @IsEmail()
//   @IsNotEmpty()
  email: string;

//   @IsString()
//   @IsNotEmpty()
  firstName: string;

//   @IsString()
//   @IsNotEmpty()
  lastName: string;

//   @IsString()
  phoneNumber?: string;

//   @IsString()
  address?: string;

//   @IsDate()
  dateOfBirth?: Date;

}