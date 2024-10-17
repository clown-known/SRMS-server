import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePointDTO {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['port', 'dock', 'wharf', 'mooring buoy']) 
  @Expose()
  type: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  longitude: number;
}
