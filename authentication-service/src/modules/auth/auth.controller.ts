import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { LoginRequest } from "./dto/request/login-request.dto";
import { AuthService } from "./auth.service";
import { RegisterRequest } from "./dto/request/register-request.dto";
import { RefreshAuthGuard } from "src/guards/refresh-auth/refresh-auth.guard";
import { JWTAuthGuard } from "src/guards/jwt-auth/jwt-auth.guard";

@Controller('auth')
export class AuthenticationController{
    constructor(private readonly authenticationService: AuthService){

    }
    @Post('login')
    login(@Body() req: LoginRequest){
        return this.authenticationService.login(req);
    }
    
    @UseGuards(JWTAuthGuard)
    @Get('logout')
    logout(@Req() req){
        return this.authenticationService.logout(req.user.id);
    }
    
    @Post('register')
    register(@Body() req: RegisterRequest){
        return this.authenticationService.register(req);
    }

    @UseGuards(RefreshAuthGuard)
    @Get('refresh')
    refresh(@Req() req){
        return this.authenticationService.refreshToken(req.user.refreshToken);
    }
}