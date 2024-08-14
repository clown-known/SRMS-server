// import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import { JwtService } from "@nestjs/jwt";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Observable } from "rxjs";
// import { PERMISSIONS_KEY } from "src/decorator/permission.decorator";
// import { Account } from "src/entity/account";
// import { Repository } from "typeorm";

// @Injectable()
// export class PermissionsGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly jwtService: JwtService,
//     @InjectRepository(Account)
//     private readonly accountRepository: Repository<Account>,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());

//     if (!requiredPermissions || requiredPermissions.length === 0) {
//       return true;
//     }

//     const request = context.switchToHttp().getRequest();
//     const token = request.headers.authorization?.split(' ')[1];

//     if (!token) {
//       throw new ForbiddenException('No token provided');
//     }

//     const decodedToken = this.jwtService.verify(token);

//     const user = await this.accountRepository.findOne({
//       where: { id: decodedToken.sub },
//       relations: ['role', 'role.permissions'],
//     });

//     if (!user || !user.role) {
//       throw new ForbiddenException('Invalid user or role');
//     }

//     const userPermissions = user.role.permissions.map(
//       (permission) => `${permission.module}:${permission.action}`,
//     );

//     const hasPermission = requiredPermissions.every((permission) =>
//       userPermissions.includes(permission),
//     );

//     if (!hasPermission) {
//       throw new ForbiddenException('Insufficient permissions');
//     }

//     return true;
//   }
// }