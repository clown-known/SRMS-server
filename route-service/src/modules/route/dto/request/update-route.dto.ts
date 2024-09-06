import { Expose } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

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
  @IsUUID()
  @Expose()
  startPointId?: string;

  @IsOptional()
  @IsUUID()
  @Expose()
  endPointId?: string;
}