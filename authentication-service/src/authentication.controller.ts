import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './service/authentication.service';
import { Account } from './entity/account';
import { CreateAccountRequest } from './inteface/account/request/create-account.dto';
import { LoginRequest } from './inteface/request/login-request.dto';
import { JWTAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly appService: AuthenticationService) {}

  @Post()
  createUser(@Body() req: CreateAccountRequest) : Promise<Account>{
    console.log(req)
    return this.appService.createAccount(req);
  }
  @Post('login')
  login(@Body() req: LoginRequest){
    return this.appService.login(req);
  }
  @UseGuards(JWTAuthGuard)
  @Get('test')
  me(@Req() req){
    return req.user;
  }

  @Post('findByEmail')
  findByEmail(@Body() req: LoginRequest){
    return this.appService.findByEmail(req.email);
  }
  
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(@Req() req){
    return this.appService.refreshToken(req.user.refreshToken);
  }
}
