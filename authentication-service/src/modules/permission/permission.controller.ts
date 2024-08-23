import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { RoleService } from "../role/role.service";
import { CreatePermissionRequestDto } from "./dto";
import { AddPermissionToRoleRequestDto } from "../role/dto/request/add-permission-request.dto";

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