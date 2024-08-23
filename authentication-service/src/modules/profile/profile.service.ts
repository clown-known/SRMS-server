import { Injectable } from "@nestjs/common";
import { Profile } from "src/entity/profile";
import { ProfileRepository } from "./profile.repository";
import { CreateProfileRequest } from "./dto/request/create-profile-request.dto";
import { UpdateProfileRequest } from "./dto/request/update-profile-request.dto";
import { ProfileDTO } from "./dto/profile.dto";

@Injectable()
export class ProfileService {
    constructor(
        private readonly _profileRepository: ProfileRepository
    ) {}

    async getProfile(accountId: string): Promise<Profile> {
        return this._profileRepository.findOne({ where: { accountId } });
    }

    async createProfile(profile: CreateProfileRequest): Promise<Profile> {
        return this._profileRepository.save(profile);
    }

    async updateProfile(profile: UpdateProfileRequest): Promise<Profile> {
        return this._profileRepository.save(profile);
    }

    async deleteProfile(accountId: string): Promise<void> {
        await this._profileRepository.delete({ accountId });
    }

    async getProfiles(): Promise<ProfileDTO[]> {
        return this._profileRepository.find();
    }
}