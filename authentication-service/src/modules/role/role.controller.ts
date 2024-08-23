import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "./role.service";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    // @Post('create')
    // async addPermissionToRole(@Body() role: CreateRoleRequestDto): Promise<RoleDTO> {
    //     //ex
    //     return this.roleService.createRole(role);
    // }
    
}