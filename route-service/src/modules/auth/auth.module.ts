import { Global, Module } from "@nestjs/common";
import { AuthGrpcService } from "./auth.grpc.service";
import { JwtModule } from "@nestjs/jwt";
import jwtConfig from "src/config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { PermissionsGuard } from "src/guards/permission.guard";

@Global()
@Module({
    imports: [    
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
    ], 
    providers: [AuthGrpcService],
    exports: [AuthGrpcService,JwtModule]
})
export class AuthModule{

}