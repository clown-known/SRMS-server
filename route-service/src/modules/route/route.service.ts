import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { UpdateRouteDTO } from "./dto/request/update-route.dto";
import { CreateRouteDTO } from "./dto/request/create-route.dto";
import { RouteDTO } from "./dto/route.dto";
import { RouteRepository } from "./route.repository";
import { Route } from "src/entity";


@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private readonly routeRepository: RouteRepository
  ) {}

  async save(createRouteDTO: CreateRouteDTO): Promise<CreateRouteDTO> {
    const savedRoute = await this.routeRepository.save(createRouteDTO);
    return plainToInstance(CreateRouteDTO, savedRoute);
  }

  async findAll(): Promise<RouteDTO[]> {
    const routes = await this.routeRepository.find();
    return plainToInstance(RouteDTO, routes);
  }

  async findOne(id: string): Promise<RouteDTO> { 
    const route = await this.routeRepository.findOne({ where: { id } });
    if (!route) {
      throw new NotFoundException('Route not found');
    }
    return plainToInstance(RouteDTO, route);
  }

  async updateRoute(id: string, updateRouteDTO: UpdateRouteDTO): Promise<UpdateRouteDTO> {
    const route = await this.findOne(id);
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