import { Body, Controller, Delete, Get, Param, Post, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { AddPermissionToRoleRequestDto } from "./dto/request/add-permission-request.dto";
import { TransactionInterceptor } from "src/common/transaction.interceptor";
import { CreateRoleRequestDto } from "./dto/request/create-role-request.dto";
import { RoleDTO } from "./dto/role.dto";
import { Test } from "./dto/request/test";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}
    @Post('add-permission-to-role')
    addPermissionToRole(@Body() permission: AddPermissionToRoleRequestDto) {
        return this.roleService.addPermissionToRole(permission);
    }
    @Post('create')
    @UseInterceptors(TransactionInterceptor)
    async createRole(@Body() role: CreateRoleRequestDto): Promise<RoleDTO> {
        return this.roleService.createRole(role);
    }
    @Post('delete')
    async deletePermissionOfRole(@Body() data : Test) {
        return this.roleService.deletePermissionOfRole(data.roleId, data.permissionId);
    }
    @Get('test')
    async test(){
        return this.roleService.test();
    }
}
