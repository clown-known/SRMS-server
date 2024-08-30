import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
  @IsUUID()
  @Expose()
  startPointId: string;

  @IsNotEmpty()
  @IsUUID()
  @Expose()
  endPointId: string;
}
