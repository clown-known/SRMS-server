import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRouteDTO {
  @IsOptional()
  @IsString()
  @Expose()
  name?: string;

  @IsOptional()
  @IsString()
  @Expose()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Expose()
  distance?: number;

  @IsOptional()
  @IsNumber()
  @Expose()
  estimatedTime?: number;

  @IsOptional()
  @IsUUID()
  @Expose()
  startPointId?: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  endPointId?: string;
}