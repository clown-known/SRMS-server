import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from '../../entity/account';
import { CreateAccountRequest } from './dto/request/create-account.dto';
import { LoginRequest } from './dto/request/login-request.dto';
import { JWTAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { PermissionsGuard } from '../../guards/permission.guard';
import { Permissions } from '../../decorator/permission.decorator';
import { Actions, Modules } from '../../common/enum';
import { ChangePasswordRequest } from './dto/request/change-password-request.dto';

@Controller('account')

export class AuthenticationController {
  constructor(private readonly authenticationService: AccountService) {}

  @Post()
  createUser(@Body() req: CreateAccountRequest) : Promise<Account>{
    console.log(req)  
    return this.authenticationService.createAccount(req);
  }

  @UseGuards(JWTAuthGuard)
  @Get('test')
  me(@Req() req){
    return req.user;
  }

  @Post('findByEmail')
  @UseGuards(PermissionsGuard)
  @Permissions([
    {module: Modules.ACCOUNT, action: Actions.CREATE},
    {module: Modules.ACCOUNT, action: Actions.GET}
  ]
  )
  findByEmail(@Body() req: LoginRequest){
    return this.authenticationService.findByEmail(req.email);
  }
  @Get(':id')
  findById(@Param('id') id: string){
    console.log(id) 
    return this.authenticationService.findById(id);
  } 
  
  @Put(':id/changePassword')
  changePassword(@Param('id') id: string,@Body() req: ChangePasswordRequest){
    return this.authenticationService.changePassword(id,req);
  }
}
