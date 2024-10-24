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
import { AssignRoleToUserRequest } from './dto/request/assign-role-to-user-request.dto';
import { UpdateAccountRequest } from './dto/request';

@Controller('account')

export class AuthenticationController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  createUser(@Body() req: CreateAccountRequest) : Promise<AccountDTO>{
    return this.accountService.createAccount(req);
  }
  @Put('update/:id')
  updateUser( @Param('id') id: string,@Body() req: UpdateAccountRequest) : Promise<AccountDTO>{
    return this.accountService.updateAccount(id,req);
  }
  @Put('update-with-role/:id')
  updateUserWithRole( @Param('id') id: string,@Body() req: UpdateAccountRequest) : Promise<AccountDTO>{
    return this.accountService.updateAccountWithRole(id,req);
  }
  // @Get(':id')
  // findById(@Param('id') id: string){
  //   return this.accountService.findById(id);
  // } 
  @Put('reset-password/:id')
  resetPassword(@Param('id') id: string){
    console.log()
    return this.accountService.resetPassword(id);
  }
  @Put('changePassword')
  @UseGuards(JWTAuthGuard)
  changePassword(@Req() req,@Body() data: ChangePasswordRequest){
    console.log(data)
    return this.accountService.changePassword(req.user.id,data);
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions([
    {module: Modules.ACCOUNT, action: Actions.READ},
  ])
  getAllAccount( @Query() pageOptionsDto: PageOptionsDto,):Promise<PageDto<AccountDTO>>{
    return this.accountService.getAllAccounts(pageOptionsDto);
  }

  @Delete(':id')
  @UseInterceptors(TransactionInterceptor)
  deleteUser(@Param('id') id: string){
    return this.accountService.softDelete(id);
  }
  @Put('assign')
  assignRoleToUser(@Body() data: AssignRoleToUserRequest){
    return this.accountService.assignRole(data.userId,data.roleId);
  }
  @Put('unassign/:id')
  unAssignRoleOfUser(@Param('id') id: string){
    return this.accountService.haftUpdate(id,{roleId:null,role:null});
  }
}
