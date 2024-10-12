import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PointDTO } from 'src/modules/point/dto/point.dto';

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
  startPointId?: PointDTO;

  @IsOptional()
  @IsUUID()
  @Expose()
  endPointId?: PointDTO;
}