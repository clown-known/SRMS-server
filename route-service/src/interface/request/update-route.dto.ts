import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateRouteDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  startPointId?: string;

  @IsOptional()
  @IsUUID()
  endPointId?: string;
}