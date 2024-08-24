import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { CreatePermissionRequestDto } from "./dto";

@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService,
    ) {}

    @Get(':id')
    getPermissionsOfUser(@Param('id') id: string) {
        return this.permissionService.getPermissionsOfUser(id);
    }
    @Post('create')
    createPermission(@Body() permission: CreatePermissionRequestDto) {
        return this.permissionService.createPermission(permission);
    }
    
}