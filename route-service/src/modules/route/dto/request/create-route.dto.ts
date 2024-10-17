import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { PointDTO } from 'src/modules/point/dto/point.dto';

export class CreateRouteDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  distance: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  estimatedTime: number;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  startPointId: PointDTO;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  endPointId: PointDTO;
}
