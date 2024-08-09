import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './service/authentication.service';
import { Account } from './entity/account';
import { CreateAccountRequest } from './inteface/request/create-account.dto';
import { LoginRequest } from './inteface/request/login-request.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard('jwt'))
  @Get('test')
  me(@Req() req){
    console.log(JSON.stringify(Object.keys(req)));
    return req.user;
  }
}
