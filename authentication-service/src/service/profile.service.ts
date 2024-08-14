import { Injectable } from "@nestjs/common";
import { Profile } from "src/entity/profile";
import { IProfile } from "src/inteface/profile/profile.inteface";
import { CreateProfileRequest, ProfileResponse, UpdateProfileRequest } from "src/inteface/request";
import { ProfileRepository } from "src/repository/";

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

    async getProfiles(): Promise<IProfile[]> {
        return this._profileRepository.find();
    }
}