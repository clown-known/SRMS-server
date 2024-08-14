import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PermissionService } from "./service/permission.service";
import { CreatePermissionRequestDto } from "./inteface/permission";
import { AddPermissionToRoleRequestDto } from "./inteface/request/add-permission-request.dto";
import { RoleService } from "./service/role.service";

@Controller('permission')
export class PermissionController {
    constructor(private readonly permissionService: PermissionService,
        private readonly roleService: RoleService
    ) {}

    @Get(':id')
    getPermissionsOfUser(@Param('id') id: string) {
        return this.permissionService.getPermissionsOfUser(id);
    }
    @Post('create')
    createPermission(@Body() permission: CreatePermissionRequestDto) {
        return this.permissionService.createPermission(permission);
    }
    @Post('add-permission-to-role')
    addPermissionToRole(@Body() permission: AddPermissionToRoleRequestDto) {
        return this.roleService.addPermissionToRole(permission);
    }
}