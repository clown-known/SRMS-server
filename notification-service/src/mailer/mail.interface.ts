import { IsNotEmpty, IsEmail, IsOptional, IsEnum, IsString } from 'class-validator';
import { EmailTemplate } from 'src/common/enum';

export class SendMailDTO {
    @IsNotEmpty()
    @IsEmail()
    to: string;

    @IsNotEmpty()
    @IsString()
    subject?: string;

    // @IsNotEmpty()
    // @IsString()
    // text: string;

    @IsNotEmpty()
    @IsEnum(EmailTemplate)
    emailTemplate: EmailTemplate;


    @IsOptional()
    context: Record<string, any>
}
