import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PERMISSIONS_KEY, PermissionsDecorator } from "src/decorator/permission.decorator";
import { AccountRepository } from "src/modules/account/account.repository";
import { PermissionRepository } from "src/modules/permission/permission.repository";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly accountRepository: AccountRepository,
        private readonly permissionRepository: PermissionRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionsDecorator[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new ForbiddenException('No token provided');
    }
    //ex
    const decodedToken = this.jwtService.verify(token);
    
    const user = await this.accountRepository.findOne(decodedToken.sub);

    if (!user ) {
        throw new ForbiddenException('Invalid user or role');
    }
    
    const userPermissions = await this.permissionRepository.getPermissionsOfUser(user.id);
    
        const permissionKeys = userPermissions.map(
            (permission) => `${permission.module}:${permission.action}`,
        );
        console.log(requiredPermissions);
        if (permissionKeys.length === 0) {
            throw new ForbiddenException('No permissions found');
        }
        const hasPermission = requiredPermissions.some((permission) =>
            permissionKeys.includes(`${permission.module}:${permission.action}`)
        ); 
        // console.log(hasPermission);
        // const hasPermission = permissionKeys.every((permission) =>
        //     requiredPermissions.includes(permission),
        // );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

    return true;
    }
}