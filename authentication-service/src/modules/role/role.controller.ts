import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { RoleService } from "./role.service";
import { AddPermissionToRoleRequestDto } from "./dto/request/add-permission-request.dto";
import { TransactionInterceptor } from "src/common/transaction.interceptor";
import { CreateRoleRequestDto } from "./dto/request/create-role-request.dto";
import { RoleDTO } from "./dto/role.dto";

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
        //ex
        console.log(role);
        return this.roleService.createRole(role);
    }
    
}