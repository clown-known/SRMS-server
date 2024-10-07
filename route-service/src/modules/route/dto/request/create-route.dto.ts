import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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
  startPointId: string;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  endPointId: string;
}
