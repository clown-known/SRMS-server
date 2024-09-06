import { Expose } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdatePointDTO {
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  longitude?: number;
}