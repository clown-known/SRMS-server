import { Expose } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsIn } from 'class-validator';

export class UpdatePointDTO {
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['port', 'dock', 'wharf', 'mooring buoy']) 
  @Expose()
  type?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  longitude?: number;
}