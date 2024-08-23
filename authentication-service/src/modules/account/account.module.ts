import { Module } from "@nestjs/common";
import { AuthenticationController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountRepository } from "./account.repository";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig, refreshTokenConfig } from "src/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "src/entity";
import { PermissionRepository } from "../permission/permission.repository";
 
@Module({
    imports: [
        TypeOrmModule.forFeature([Account]),
        ConfigModule.forFeature(jwtConfig),
        ConfigModule.forFeature(refreshTokenConfig),
    ],
    controllers: [AuthenticationController],
    providers: [
        AccountService,
        AccountRepository,
        PermissionRepository
    ],
    exports:[AccountService]
    })
export class AccountModule {}