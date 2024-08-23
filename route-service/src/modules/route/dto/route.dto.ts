import { PointDTO } from "src/modules/point/dto/point.dto";

export class RouteDTO{
    id: string;
    name: string;
    description: string;
    startPoint: PointDTO;
    endPoint: PointDTO;
}