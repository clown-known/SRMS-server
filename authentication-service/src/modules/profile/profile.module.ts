import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Profile } from "src/entity";
import { ProfileRepository } from "./profile.repository";

@Module({
    imports:[
        TypeOrmModule.forFeature([Profile]),
    ],
    controllers:[ProfileController],
    providers:[ProfileService,ProfileRepository],
    exports:[ProfileService]
})
export class ProfileModule{}