import { Injectable } from "@nestjs/common";
import { Profile } from "src/entity/profile";
import { ProfileRepository } from "./profile.repository";
import { CreateProfileRequest } from "./dto/request/create-profile-request.dto";
import { UpdateProfileRequest } from "./dto/request/update-profile-request.dto";
import { ProfileDTO } from "./dto/profile.dto";
import { DeepPartial } from "typeorm";

@Injectable()
export class ProfileService {
    constructor(
        private readonly _profileRepository: ProfileRepository
    ) {}

    async getProfile(accountId: string): Promise<ProfileDTO> {
        return this._profileRepository.getProfile(accountId);
    }

    async createProfile(profile: DeepPartial<CreateProfileRequest>) {
        return this._profileRepository.save(profile);
    }

    async updateProfile(accountId :string, profile: UpdateProfileRequest) {
        return this._profileRepository.update(accountId,profile);
    }

    async deleteProfile(accountId: string): Promise<void> {
        await this._profileRepository.delete(accountId);
    }

    async getProfiles(): Promise<ProfileDTO[]> {
        return this._profileRepository.find();
    }
}