import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionRequestDto } from "./dto";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { PermissionDTO } from "./dto/permission.dto";
import { PageDto } from "src/common/pagination/page.dto";

@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService,
    ) {}

    @Get()
    getAllPermission(@Query() pageOptionsDto: PageOptionsDto,): Promise<PageDto<PermissionDTO>>{
        return this.permissionService.getAllPermission(pageOptionsDto);
    }

    @Get(':id')
    getPermissionsOfUser(@Param('id') id: string) {
        return this.permissionService.getPermissionsOfUser(id);
    }
    @Post('create')
    createPermission(@Body() permission: CreatePermissionRequestDto) {
        return this.permissionService.createPermission(permission);
    }
    @Post()
    getbyid(@Body() id:string){
        return this.permissionService.getPermissionById(id);
    }
}