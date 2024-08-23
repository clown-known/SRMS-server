import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RouteService } from "./route.service";
import { Route } from "../../entity/route";
import { CreateRouteDTO } from "./dto/request/create-route.dto";
import { UpdateRouteDTO } from "./dto/request/update-route.dto";
import { RouteDTO } from "./dto/route.dto";

@Controller('routes')
export class RouteController {
    constructor(private readonly routeService: RouteService) {}

    @Post()
    async create(@Body() createRouteDTO: CreateRouteDTO): Promise<CreateRouteDTO> {
        return this.routeService.save(createRouteDTO);
    }

    @Get()
    async findAll(): Promise<RouteDTO[]> {
        const routes = await this.routeService.findAll();
        return routes.map(route => new RouteDTO());
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<RouteDTO> {
        const route = await this.routeService.findOne(id);
        return new RouteDTO();
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateRouteDTO: UpdateRouteDTO): Promise<UpdateRouteDTO> {
        return this.routeService.updateRoute(id, updateRouteDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        const routeDTO = new RouteDTO();
        routeDTO.id = id;
        return this.routeService.removeRoute(routeDTO);
    }
}