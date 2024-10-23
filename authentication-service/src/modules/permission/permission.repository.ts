import { Inject, Injectable, Scope } from "@nestjs/common";
import { Permission } from "src/entity/permission";
import { DataSource, In, Like, Repository } from "typeorm";
import { BaseRepository } from "src/common/base-repository";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Account } from "src/entity/account";
import { CreatePermissionRequestDto } from "./dto";
import { PermissionDTO } from "./dto/permission.dto";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { transformToDTO } from "src/common/transform.util";

@Injectable({scope: Scope.REQUEST})
export class PermissionRepository extends BaseRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    async getPermissionsOfUser(id: string): Promise<PermissionDTO[]> {
        const user = await this.getRepository(Account).findOne({
            where: { id },
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
        });
        if (!user) {
            throw new Error('User not found');
        }
        if (!user.role) {
            return []
        }
        const result = user.role.rolePermissions.map(rp => rp.permission);
        return transformToDTO(PermissionDTO,result)
    }
    async softDelete(id: string){
        return this.getRepository(Permission).softDelete(id);
    }
    async update(id: string, data: CreatePermissionRequestDto){
        return this.getRepository(Permission).update(id,data);
    }

    async save(data:CreatePermissionRequestDto){
        return this.getRepository(Permission).save(data);
    }

    async findOne(id: string){
        const value = await this.getRepository(Permission).findOne({ where: { id } });
        return transformToDTO(PermissionDTO,value);
    }

    async find(ids?: string[]): Promise<PermissionDTO[]> {
        if (ids && ids.length > 0) {
            const result = await this.getRepository(Permission).findBy({
                id: In(ids)
            });
            return transformToDTO(PermissionDTO,result);
        }
        const result = await this.getRepository(Permission).find();
        return transformToDTO(PermissionDTO,result)
    }
    async findWithOptions(pageOptionsDto?: PageOptionsDto,): Promise<[PermissionDTO[],itemCount: number]>{

        const queryBuilder = this.getRepository(Permission).createQueryBuilder("permission");
        // Count total items
        const itemCount = await queryBuilder
            .where({
                module: Like('%' + pageOptionsDto.searchKey + '%')
            })
            .getCount();

        // Fetch paginated results
        const entities = await queryBuilder
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take)
            .orderBy('module',"ASC","NULLS LAST")
            .getMany();

        console.log(itemCount); // Log total count
        return [transformToDTO(PermissionDTO, entities),itemCount];
        // return transformToDTO(PermissionDTO,value)
    }
}

