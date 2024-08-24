import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { JWTAuthGuard } from "src/guards/jwt-auth/jwt-auth.guard";
import { CreateProfileRequest } from "./dto/request/create-profile-request.dto";

@Controller('profile')

export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    @UseGuards(JWTAuthGuard)
    getProfile(@Req() req){
        console.log(req.user)
        return this.profileService.getProfile(req.user.id);
    }
    @Post()
    @UseGuards(JWTAuthGuard)
    createProfile(@Req() req,@Body() data: CreateProfileRequest){
        return this.profileService.createProfile(req.user.id,data);
    }
}
