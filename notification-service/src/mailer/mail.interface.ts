import { IsNotEmpty, IsEmail, IsString, IsOptional } from 'class-validator';

export class SendMailDTO {
    @IsNotEmpty()
    @IsEmail()
    to: string;

    @IsNotEmpty()
    @IsString()
    subject: string;

    // @IsNotEmpty()
    // @IsString()
    // text: string;

    @IsOptional()
    context: {
        name: string;
        code: string;
    };
}
