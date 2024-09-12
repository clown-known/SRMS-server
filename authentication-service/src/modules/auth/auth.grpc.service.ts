import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthGrpcService {
    constructor(private readonly authService: AuthService){}

    @GrpcMethod('PermissionService', 'GetPermission')
    async GetPermission(data: { userId: string }): Promise< string[] > {
        const permission = await this.authService.getPermissionsOfUser(data.userId);
        if(permission != null && permission.length != 0){ 
            const permissionKeys = permission.map(
                (perm) => `${perm.module}:${perm.action}`,
            );
            return permissionKeys;
        }
        return []
    }
}