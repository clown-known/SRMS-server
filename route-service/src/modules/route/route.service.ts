import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { UpdateRouteDTO } from "./dto/request/update-route.dto";
import { CreateRouteDTO } from "./dto/request/create-route.dto";
import { RouteDTO } from "./dto/route.dto";
import { RouteRepository } from "./route.repository";
import { Point, Route } from "src/entity";
import { validate } from "class-validator";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";
import { Like } from "typeorm";
import { PointRepository } from "../point/point.repository";


@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(RouteRepository)
    private readonly routeRepository: RouteRepository,
    @InjectRepository(PointRepository)
    private readonly pointRepository: PointRepository,
) {}

async save(createRouteDTO: CreateRouteDTO): Promise<CreateRouteDTO> {
  const startPoint = await this.pointRepository.findOne({ where: { id: createRouteDTO.startPointId } });
  const endPoint = await this.pointRepository.findOne({ where: { id: createRouteDTO.endPointId } });
  if (!startPoint) {
    throw new BadRequestException('Invalid startPoint ID');
  }
  if (!endPoint) {
    throw new BadRequestException('Invalid endPoint ID');
  }
  const route = new Route();
  route.name = createRouteDTO.name;
  route.description = createRouteDTO.description;
  route.startPoint = startPoint;
  route.endPoint = endPoint;

  const savedRoute = await this.routeRepository.save(route);
  return plainToInstance(CreateRouteDTO, savedRoute);
}


async findAll(pageOptionsDto: PageOptionsDto): Promise<{ data: RouteDTO[]; meta: PageMetaDto }> {
  const [routes, itemCount] = await this.routeRepository.findAndCount({
    relations: ['startPoint', 'endPoint'],
    where: [
      { name: Like(`%${pageOptionsDto.searchKey}%`) },
      { description: Like(`%${pageOptionsDto.searchKey}%`) },
    ],
    take: pageOptionsDto.take,
    skip: pageOptionsDto.skip,
    order: {
      [pageOptionsDto.orderBy || 'name']: pageOptionsDto.order,
    },
  });

  const pageMetaDto = new PageMetaDto({
    pageOptionsDto,
    itemCount,
  });

  return {
    data: plainToInstance(RouteDTO, routes),
    meta: pageMetaDto,
  };
}
  
  async findOne(id: string): Promise<RouteDTO> { 
    const route = await this.routeRepository.findOne({ 
      where: { id },
      relations: ['startPoint', 'endPoint' ],
     });
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return plainToInstance(RouteDTO, route);
  }

  async updateRoute(id: string, updateRouteDTO: UpdateRouteDTO): Promise<UpdateRouteDTO> {
    const route = await this.findOne(id);
    if (!route) {
      throw new NotFoundException('Route not found');
    }
        const errors = await validate(updateRouteDTO);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }

    Object.assign(route, updateRouteDTO);
    const updatedRoute = await this.routeRepository.save(route);
    return plainToInstance(UpdateRouteDTO, updatedRoute);
  }


  async removeRoute(routeDTO: RouteDTO): Promise<void> {
    const route = await this.routeRepository.findOne({ where: { id: routeDTO.id } });
    if (!route) {
        throw new NotFoundException('Route not found');
    }
    await this.routeRepository.remove(route);
  }

}