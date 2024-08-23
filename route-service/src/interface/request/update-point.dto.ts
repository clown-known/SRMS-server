import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePointDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}