import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { RouteService } from "./route.service";
import { CreateRouteDTO } from "./dto/request/create-route.dto";
import { UpdateRouteDTO } from "./dto/request/update-route.dto";
import { RouteDTO } from "./dto/route.dto";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { validate } from "class-validator";
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
        const errors = await validate(createRouteDTO);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }
        return this.routeService.save(createRouteDTO);
    }

    @Get()
    async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<RouteDTO>> {
        return this.routeService.findAll(pageOptionsDto);
    }

    @Get(':id')
    @UseGuards(PermissionsGuard)
    @Permissions([
        {module: Modules.ROUTE, action: Actions.READ},
    ])
    async findOne(@Param('id') id: string): Promise<RouteDTO> {
        return this.routeService.findOne(id); 
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