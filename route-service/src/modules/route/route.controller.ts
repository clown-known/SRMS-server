import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { RouteService } from "./route.service";
import { CreateRouteDTO } from "./dto/request/create-route.dto";
import { UpdateRouteDTO } from "./dto/request/update-route.dto";
import { RouteDTO } from "./dto/route.dto";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { PermissionsGuard } from "src/guards/permission.guard";
import { Actions, Modules } from "src/common/enum";
import { Permissions } from "src/decorator/permission.decorator";

@Controller('routes')
export class RouteController {
    constructor(private readonly routeService: RouteService) {}

    @Post()
    @UseGuards(PermissionsGuard)
    @Permissions([
        {module: Modules.ROUTE, action: Actions.CREATE},
    ])
    async create(@Body() createRouteDTO: CreateRouteDTO): Promise<CreateRouteDTO> {
        return this.routeService.save(createRouteDTO);
    }

    @Get()
    @UseGuards(PermissionsGuard)
    @Permissions([
        {module: Modules.ROUTE, action: Actions.GET_ALL},
    ])
    async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<RouteDTO>> {
        return this.routeService.findAll(pageOptionsDto);
    }

    @Get(':id')
    @UseGuards(PermissionsGuard)
    @Permissions([
        {module: Modules.ROUTE, action: Actions.GET_ALL},
        {module: Modules.ROUTE, action: Actions.GET},
    ])
    async findOne(@Param('id') id: string): Promise<RouteDTO> {
        const route = await this.routeService.findOne(id);
        return new RouteDTO();
    }

    @Patch(':id')
    @UseGuards(PermissionsGuard)
    @Permissions([
        {module: Modules.ROUTE, action: Actions.UPDATE},
    ])
    async update(@Param('id') id: string, @Body() updateRouteDTO: UpdateRouteDTO): Promise<UpdateRouteDTO> {
        return this.routeService.updateRoute(id, updateRouteDTO);
    }

    @Delete(':id')
    @UseGuards(PermissionsGuard)
    @Permissions([
        {module: Modules.ROUTE, action: Actions.DELETE},
    ])
    async remove(@Param('id') id: string): Promise<void> {
        const routeDTO = new RouteDTO();
        routeDTO.id = id;
        return this.routeService.removeRoute(routeDTO);
    }
}