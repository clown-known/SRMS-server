import { Expose } from "class-transformer";
import { PointDTO } from "src/modules/point/dto/point.dto";

export class RouteDTO{
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    distance: number;

    @Expose()
    estimatedTime: number;

    @Expose()
    startPoint: PointDTO;

    @Expose()
    endPoint: PointDTO;
}