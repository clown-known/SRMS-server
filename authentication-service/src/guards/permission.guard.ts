import { InjectRedis } from "@nestjs-modules/ioredis";
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import { PERMISSIONS_KEY, PermissionsDecorator } from "src/decorator/permission.decorator";
import { AccountRepository } from "src/modules/account/account.repository";
import { AuthService } from "src/modules/auth/auth.service";
import { PermissionService } from "src/modules/permission/permission.service";
require('dotenv').config();
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
        throw new UnauthorizedException('No token provided');
    }
    // verify token is expired or invalid
    const decodedToken = (() => {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('token is invalid!');
        }
    })()
    if(decodedToken.sub == process.env.ADMIN_ID) return true;

    const getUserPermissionFromDBAndPutToCache = async () =>{
        const permissions = await this.authService.getPermissionsOfUser(decodedToken.sub);
        // console.log(permissions)
        if (permissions) {
            await this.redis.set('permission:'+decodedToken.sub, JSON.stringify(permissions));
            await this.redis.expire('permission:'+decodedToken.sub, 400);
        }
        return permissions || [];
    }
    const getUserPermissions = async () => {
        const cachedPermissions = await this.redis.get('permission:'+decodedToken.sub);
        // console.log(JSON.parse(cachedPermissions))
        if (cachedPermissions) return JSON.parse(cachedPermissions);
        return getUserPermissionFromDBAndPutToCache();
    };

    const hasPermission = (userPermissions) => {
        // console.log('user per: '+userPermissions)
        if(userPermissions==null) return false;
        const permissionKeys = userPermissions?.map(
            (permission) => `${permission.module}:${permission.action}`,
        );
        return requiredPermissions?.some((permission) =>
            permissionKeys?.includes(`${permission.module}:${permission.action}`)); 
    }
    if(hasPermission((await getUserPermissions()))) return true;
    if (!hasPermission((await getUserPermissionFromDBAndPutToCache()))) {
        throw new ForbiddenException('Insufficient permissions');
    }
    return true;
    }
}