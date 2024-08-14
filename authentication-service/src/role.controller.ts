import { Body, Controller, Post } from "@nestjs/common";
import { RoleService } from "./service/role.service";
import { CreateRoleRequestDto } from "./inteface/role/request/create-role-request.dto";
import { Roles } from "./entity/role";

@Controller('role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Post('create')
    async addPermissionToRole(@Body() role: CreateRoleRequestDto): Promise<Roles> {
        return this.roleService.createRole(role);
    }
}