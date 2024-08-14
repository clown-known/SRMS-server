import { AuthGuard } from "@nestjs/passport";

export class JWTAuthGuard extends AuthGuard('jwt'){
    // constructor(private readonly jwtConfiguration: ConfigType<typeof jwtConfig>){
    //     super();
    // }
}