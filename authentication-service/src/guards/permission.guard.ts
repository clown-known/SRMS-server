import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { PERMISSIONS_KEY } from "src/decorator/permission.decorator";
import { AccountRepository, PermissionRepository } from "src/repository";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly accountRepository: AccountRepository,
        private readonly permissionRepository: PermissionRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.get<string>(PERMISSIONS_KEY, context.getHandler());

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
    
    const user = await this.accountRepository.findOne({
        where: { id: decodedToken.sub }
    });

    if (!user ) {
        throw new ForbiddenException('Invalid user or role');
    }
    
    const userPermissions = await this.permissionRepository.getPermissionsOfUser(user.id);
    
        const permissionKeys = userPermissions.map(
            (permission) => `${permission.module}:${permission.action}`,
        );
        if (permissionKeys.length === 0) {
            throw new ForbiddenException('No permissions found');
        }
        // const hasPermission = requiredPermissions.every((permission) =>
        //     permissionKeys.includes(permission),
        // );

        const hasPermission = permissionKeys.every((permission) =>
            requiredPermissions.includes(permission),
        );

        if (!hasPermission) {
            throw new ForbiddenException('Insufficient permissions');
        }

    return true;
    }
}