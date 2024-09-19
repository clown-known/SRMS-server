import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { LoginRequest } from "./dto/request/login-request.dto";
import { AuthService } from "./auth.service";
import { RegisterRequest } from "./dto/request/register-request.dto";
import { RefreshAuthGuard } from "src/guards/refresh-auth/refresh-auth.guard";
import { JWTAuthGuard } from "src/guards/jwt-auth/jwt-auth.guard";
import { TransactionInterceptor } from "src/common/transaction.interceptor";
import { ForgotPasswordRequest } from "./dto/request/forgot-password-request.dto";
import { ConfirmAuthencodeRequest } from "./dto/request/confirm-authencode-request.dto";
import { JwtResetPasswordStrategy } from "src/stragery/jwt.reset.password.strategy";
import { ResetPasswordGuard } from "src/guards/reset-password.guard";
import { ResetPasswordRequest } from "./dto/request/reset-password.request.dto";

@Controller('auth')
export class AuthenticationController{
    constructor(private readonly authenticationService: AuthService,
    ){
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
    @UseInterceptors(TransactionInterceptor)
    register(@Body() req: RegisterRequest){
        console.log(req);
        return this.authenticationService.register(req);
    }

    @UseGuards(RefreshAuthGuard)
    @Get('refresh')
    refresh(@Req() req){
        return this.authenticationService.refreshToken(req.user.refreshToken);
    }

    @Post('forgot-password')
    forgotPassword(@Body() data: ForgotPasswordRequest){
        return this.authenticationService.createAuthenCode(data.email)
    }

    @Post('confirm-code')
    confirmAuthenCode(@Body() data : ConfirmAuthencodeRequest){
        console.log(data)
        return this.authenticationService.confirmAuthencode(data);
    }

    @UseGuards(ResetPasswordGuard)
    @Post('reset-password')
    resetPassword(@Req() req, @Body() data:  ResetPasswordRequest ){
        console.log(req.user.id)
        return this.authenticationService.resetPassword(req.user.id,data.newPassword);
    }
}