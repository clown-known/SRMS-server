import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BaseRepository } from "src/common/base-repository";
import { Profile } from "src/entity/profile";
import { DataSource, DeepPartial, In } from "typeorm";
import { ProfileDTO } from "./dto/profile.dto";
import { CreateProfileRequest } from "./dto/request/create-profile-request.dto";
import { UpdateProfileRequest } from "./dto/request/update-profile-request.dto";
import { transformToDTO } from "src/common/transform.util";
@Injectable({scope:Scope.REQUEST})
export class ProfileRepository extends BaseRepository{
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async getProfile(id: string){
        const data = await this.getRepository(Profile).findOne({where:{accountId:id}});
        if(data==null) throw new NotFoundException('profile not found!');
        return transformToDTO(ProfileDTO,data)
    }
    
    async getProfileByAccountId(id: string) : Promise<ProfileDTO|null>{
        const data = await this.getRepository(Profile).findOne({where:{accountId:id}});
        if(data==null) return null;
        return transformToDTO(ProfileDTO,data);
    }
    async find(id?: string[]) : Promise<ProfileDTO[]>{
        if (id && id.length > 0) {
            return transformToDTO (ProfileDTO, (await this.getRepository(Profile).findBy({id: In(id)})));
        }
        return transformToDTO(ProfileDTO,(await this.getRepository(Profile).find()));
    }
    async save(data: DeepPartial<CreateProfileRequest|null>){
        const saved = await this.getRepository(Profile).save({...data});
        return transformToDTO(ProfileDTO,saved);
    }
    async update(accountId: string, data: UpdateProfileRequest){
        const profile = await this.getProfileByAccountId(accountId);
        if(profile==null)
            throw new BadRequestException('account is not exist!');
        const saved = await this.getRepository(Profile).update(profile.id,{...data}as Profile);
        return transformToDTO(ProfileDTO,saved);
    }
    async delete(accountId: string){
        return await this.getRepository(Profile).softDelete({accountId});
    }
}
