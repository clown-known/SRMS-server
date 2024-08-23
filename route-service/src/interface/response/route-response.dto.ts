import { PointResponseDto } from './point-response.dto';

export class RouteResponseDto {
  id: string;
  name: string;
  description: string;
  startPoint: PointResponseDto;
  endPoint: PointResponseDto;
}
