import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionRequestDto } from "./dto";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { PermissionDTO } from "./dto/permission.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { UpdatePermissionRequestDto } from "./dto/request/update-permission-request.dto";
import { TransactionInterceptor } from "src/common/transaction.interceptor";

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
    @Put(':id')
    updatePermission(@Param('id')id:string, @Body() permission: UpdatePermissionRequestDto) {
        return this.permissionService.updatePermission(id,permission);
    }
    @Delete(':id')
    @UseInterceptors(TransactionInterceptor)
    deletePermission(@Param('id')id: string){
        return this.permissionService.deletePermission(id);
    }
    @Post()
    getbyid(@Body() id:string){
        return this.permissionService.getPermissionById(id);
    }
}