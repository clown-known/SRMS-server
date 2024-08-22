import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './service/authentication.service';
import { Account } from './entity/account';
import { CreateAccountRequest } from './inteface/account/request/create-account.dto';
import { LoginRequest } from './inteface/request/login-request.dto';
import { JWTAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { PermissionsGuard } from './guards/permission.guard';
import { Permissions } from './decorator/permission.decorator';
import { Actions, Modules } from './common/enum';
import { ChangePasswordRequest, RegisterRequest } from './inteface/request';


@Controller('auth')

export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post()
  createUser(@Body() req: CreateAccountRequest) : Promise<Account>{
    console.log(req)  
    return this.authenticationService.createAccount(req);
  }
  @Post('login')
  login(@Body() req: LoginRequest){
    return this.authenticationService.login(req);
  }
  @UseGuards(JWTAuthGuard)
  @Get('test')
  me(@Req() req){
    return req.user;
  }

  @Post('findByEmail')
  @UseGuards(PermissionsGuard)
  @Permissions([
    {module: Modules.ACCOUNT, action: Actions.GET_ALL}]
  )
  findByEmail(@Body() req: LoginRequest){
    return this.authenticationService.findByEmail(req.email);
  }
  
  @Post('register')
  register(@Body() req: RegisterRequest){
    return this.authenticationService.register(req);
  }
  
  @Put(':id/changePassword')
  changePassword(@Param('id') id: string,@Body() req: ChangePasswordRequest){
    return this.authenticationService.changePassword(id,req);
  }

  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  refresh(@Req() req){
    return this.authenticationService.refreshToken(req.user.refreshToken);
  }
}
