import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRouteDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  startPointId: string;

  @IsNotEmpty()
  @IsUUID()
  endPointId: string;
}
