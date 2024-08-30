import { Expose } from "class-transformer";

export class PointDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;
}