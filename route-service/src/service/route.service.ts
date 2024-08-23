import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Route } from "src/entity/route";
import { CreateRouteDTO, UpdateRouteDTO } from "src/interface/request";
import { RouteRepository } from "src/repository/route.repository";


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

  async findAll(): Promise<Route[]> {
    return this.routeRepository.find();
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.routeRepository.findOne({ where: { id } });
    if(!route){
      throw new NotFoundException('Route not found');
    }
    return route;
  }

  async updateRoute(id: string, updateRouteDTO: UpdateRouteDTO): Promise<UpdateRouteDTO> {
    const route = await this.findOne(id);
    Object.assign(route, updateRouteDTO);
    const updatedRoute = await this.routeRepository.save(route);
    return plainToInstance(UpdateRouteDTO, updatedRoute);
  }

  async removeRoute(id: string): Promise<void> {
    const route = await this.findOne(id);
    await this.routeRepository.remove(route);
  }

}