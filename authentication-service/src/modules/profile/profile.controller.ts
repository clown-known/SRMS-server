import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { JWTAuthGuard } from "src/guards/jwt-auth/jwt-auth.guard";
import { CreateProfileRequest } from "./dto/request/create-profile-request.dto";
import { PermissionsGuard } from "src/guards/permission.guard";
import { Permissions } from "src/decorator/permission.decorator";
import { Actions, Modules } from "src/common/enum";
import { UpdateProfileRequest } from "./dto/request/update-profile-request.dto";

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @UseGuards(JWTAuthGuard)
    getProfile(@Req() req){
        console.log(req.user)
        return this.profileService.getProfile(req.user.id);
    }
    @Get('all')
    @UseGuards(PermissionsGuard)
    @Permissions([
    {module: Modules.ACCOUNT, action: Actions.READ}
    ])
    getAllProfile(@Req() req){
        console.log(req.user)
        return this.profileService.getProfiles();
    }
    @Post()
    @UseGuards(JWTAuthGuard)
    createProfile(@Body() data: CreateProfileRequest){
        return this.profileService.createProfile(data);
    }
    @Put()
    @UseGuards(JWTAuthGuard)
    updateMyProfile(@Req() req,@Body() data: UpdateProfileRequest){
        return this.profileService.updateProfile(req.user.id,data);
    }
}
