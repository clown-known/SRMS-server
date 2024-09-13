import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UnauthorizedException, UseGuards, UseInterceptors } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountRequest } from './dto/request/create-account.dto';
import { JWTAuthGuard } from '../../guards/jwt-auth/jwt-auth.guard';
import { PermissionsGuard } from '../../guards/permission.guard';
import { Permissions } from '../../decorator/permission.decorator';
import { Actions, Modules } from '../../common/enum';
import { ChangePasswordRequest } from './dto/request/change-password-request.dto';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { AccountDTO } from './dto/account.dto';
import { PageDto } from 'src/common/pagination/page.dto';
import { TransactionInterceptor } from 'src/common/transaction.interceptor';

@Controller('account')

export class AuthenticationController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  createUser(@Body() req: CreateAccountRequest) : Promise<AccountDTO>{
    return this.accountService.createAccount(req);
  }

  @Get(':id')
  findById(@Param('id') id: string){
    return this.accountService.findById(id);
  } 
  
  @Put(':id/changePassword')
  @UseGuards(JWTAuthGuard)
  changePassword(@Req() req, @Param('id') id: string,@Body() data: ChangePasswordRequest){
    if(req.user.id != id) throw new UnauthorizedException('Token is not valid for this user!');
    return this.accountService.changePassword(id,data);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions([
    {module: Modules.ACCOUNT, action: Actions.GET_ALL},
  ])
  getAllAccount( @Query() pageOptionsDto: PageOptionsDto,):Promise<PageDto<AccountDTO>>{
    return this.accountService.getAllAccounts(pageOptionsDto);
  }

  @Delete(':id')
  @UseInterceptors(TransactionInterceptor)
  deleteUser(@Param('id') id: string){
    return this.accountService.softDelete(id);
  }
}
