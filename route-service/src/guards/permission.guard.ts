import { InjectRedis } from "@nestjs-modules/ioredis";
import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Redis } from "ioredis";
import { PERMISSIONS_KEY, PermissionsDecorator } from "src/decorator/permission.decorator";
import { AuthGrpcService } from "src/modules/auth/auth.grpc.service";
require('dotenv').config();
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
        private readonly authService: AuthGrpcService,
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

    // get permission from cache if not exist check in database, and set it to cache for another request
    const getUserPermissionFromDBAndPutToCache = async () =>{
        const permissions = await this.authService.getPermissionsOfUser(decodedToken.sub); 
        if (permissions) {
            await this.redis.set('permission:'+decodedToken.sub, JSON.stringify(permissions));
            await this.redis.expire('permission:'+decodedToken.sub, 400);
        }
        return permissions || [];
    }
    const getUserPermissions = async () => {
        const cachedPermissions = await this.redis.get('permission:'+decodedToken.sub);
        // console.log(JSON.parse(cachedPermissions))
        if (cachedPermissions) return await JSON.parse(cachedPermissions);
        return getUserPermissionFromDBAndPutToCache();
    };
    // map permission to partern
    // check permission is in required list or not
    const hasPermission = (userPermissions) => {
        console.log('user per: ' + userPermissions);
        console.log(`req per: ${requiredPermissions.map(p => `${p.module}:${p.action}`).join(', ')}`);
        if (!userPermissions) return false;

        const permissionKeys = userPermissions.map(
            (permissionk) => `${permissionk.module}:${permissionk.action}`,
        );

        console.log('permissionKeys:', permissionKeys); // Debug log

        const hasAccess = requiredPermissions.some((requiredPermission) =>
            permissionKeys.includes(`${requiredPermission.module}:${requiredPermission.action}`)
        );

        console.log('hasAccess:', hasAccess); // Debug log
        return hasAccess;
    };
    if(hasPermission((await getUserPermissions()))) return true;
    if (!hasPermission((await getUserPermissionFromDBAndPutToCache()))) {
        throw new ForbiddenException('Insufficient permissions');
    }
    return true;
    }
}
