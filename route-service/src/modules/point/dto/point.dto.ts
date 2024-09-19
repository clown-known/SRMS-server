import { Expose } from "class-transformer";

export class PointDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  type: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;
}