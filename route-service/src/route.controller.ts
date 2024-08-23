import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RouteService } from "./service/route.service";
import { CreateRouteDTO, UpdateRouteDTO } from "./interface/request";
import { Route } from "./entity/route";

@Controller('routes')
export class RouteController {
    constructor(private readonly routeService: RouteService) {}

    @Post()
    async create(@Body() createRouteDTO: CreateRouteDTO): Promise<CreateRouteDTO> {
        return this.routeService.save(createRouteDTO);
    }

    @Get()
    async findAll(): Promise<Route[]> {
        return this.routeService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Route> {
        return this.routeService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateRouteDTO: UpdateRouteDTO): Promise<UpdateRouteDTO> {
        return this.routeService.updateRoute(id, updateRouteDTO);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.routeService.removeRoute(id);
    }
}