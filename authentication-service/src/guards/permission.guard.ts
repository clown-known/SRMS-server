import { InjectRedis } from "@nestjs-modules/ioredis";
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import { PERMISSIONS_KEY, PermissionsDecorator } from "src/decorator/permission.decorator";
import { AccountRepository } from "src/modules/account/account.repository";
import { AuthService } from "src/modules/auth/auth.service";
import { PermissionService } from "src/modules/permission/permission.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        @InjectRedis() private readonly redis: Redis,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionsDecorator[]>(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    // check permission of controller
    if (!requiredPermissions || requiredPermissions.length === 0) {
        return true;
    }
    // get token
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    if (!token) {
        throw new ForbiddenException('No token provided');
    }
    // verify token is expired or invalid
    const decodedToken = (() => {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new ForbiddenException('token is invalid!');
        }
    })()
    // const decodedToken =this.jwtService.verify(token);
    // console.log(decodedToken.sub)
    // const user = await this.accountRepository.findOne(decodedToken.sub);
    // console.log(user)
    // if (!user ) {
    //     throw new ForbiddenException('Invalid user or role');
    // }
    // get permission from cache if not exist check in database, and set it to cache for another request
    const getUserPermissionFromDB = async () =>{
        const permissions = await this.authService.getPermissionsOfUser(decodedToken.sub);
        if (permissions) {
            await this.redis.set('permission:'+decodedToken.sub, JSON.stringify(permissions));
            await this.redis.expire('permission:'+decodedToken.sub, 86400);
        }
        return permissions || [];
    }
    const getUserPermissions = async () => {
        const cachedPermissions = await this.redis.get('permission:'+decodedToken.sub);
        if (cachedPermissions) return JSON.parse(cachedPermissions);
        return getUserPermissionFromDB();
    };
    const userPermissions = await getUserPermissions();
    // map permission to partern
    // check permission is in required list or not
    const hasPermission = (permission) => {
        if(permission==null) return false;
        const permissionKeys = userPermissions.map(
            (permission) => `${permission.module}:${permission.action}`,
        );
        return requiredPermissions.some((permission) =>
            permissionKeys.includes(`${permission.module}:${permission.action}`)); 
    }
    if(hasPermission(userPermissions)) return true;
    if (!hasPermission(await getUserPermissionFromDB)) {
        throw new ForbiddenException('Insufficient permissions');
    }
    return true;
    }
}