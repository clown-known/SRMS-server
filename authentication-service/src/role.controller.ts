import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "./service/role.service";
import { CreateRoleRequestDto } from "./inteface/role/request/create-role-request.dto";
import { RoleDTO } from "./inteface/role/role.dto";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    // @Post('create')
    // async addPermissionToRole(@Body() role: CreateRoleRequestDto): Promise<RoleDTO> {
    //     //ex
    //     return this.roleService.createRole(role);
    // }
    
}