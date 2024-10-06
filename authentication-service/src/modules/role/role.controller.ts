import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { AddPermissionToRoleRequestDto } from "./dto/request/add-permission-request.dto";
import { TransactionInterceptor } from "src/common/transaction.interceptor";
import { CreateRoleRequestDto } from "./dto/request/create-role-request.dto";
import { RoleDTO } from "./dto/role.dto";
import { UpdateRoleDTO } from "./dto/request/update-role-request.dto";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { PermissionsGuard } from "src/guards/permission.guard";
import { Permissions } from "src/decorator/permission.decorator";
import { Actions, Modules } from "src/common/enum";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    // @UseGuards(PermissionsGuard)
    // @Permissions([
    //     {module: Modules.ROLE, action: Actions.GET_ALL},
    // ])
    getRoles(@Query() pageOptionsDto: PageOptionsDto){
        return this.roleService.getAll(pageOptionsDto);
    }
    @Get('id')
    // @UseGuards(PermissionsGuard)
    // @Permissions([
    //     {module: Modules.ROLE, action: Actions.GET},
    // ])
    getPermission(@Param('id')id: string){
        return this.roleService.getById(id)
    }

    @Post('add-permission-to-role')
    addPermissionToRole(@Body() permission: AddPermissionToRoleRequestDto) {
        return this.roleService.addPermissionToRole(permission);
    }
    @Post('create')
    @UseInterceptors(TransactionInterceptor)
    // @UseGuards(PermissionsGuard)
    // @Permissions([
    //     {module: Modules.ROLE, action: Actions.CREATE},
    // ])
    async createRole(@Body() role: CreateRoleRequestDto): Promise<RoleDTO> {
        return this.roleService.createRole(role);
    }

    @Put(':id')
    @UseInterceptors(TransactionInterceptor)
    // @UseGuards(PermissionsGuard)
    // @Permissions([
    //     {module: Modules.ROLE, action: Actions.UPDATE},
    // ])
    async updateRole(@Param('id')id: string, @Body() data: UpdateRoleDTO){
        return this.roleService.updateRole(id,data);
    }

    @Delete(':id')
    @UseInterceptors(TransactionInterceptor)
    // @UseGuards(PermissionsGuard)
    // @Permissions([
    //     {module: Modules.ROLE, action: Actions.DELETE},
    // ])
    async deleteRole(@Param('id')id:string){
        return this.roleService.delete(id);
    }
}
