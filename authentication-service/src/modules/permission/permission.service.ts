import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "./permission.repository";
import { CreatePermissionRequestDto } from "./dto";
import { PageOptionsDto } from "src/common/pagination/page-options.dto";
import { PermissionDTO } from "./dto/permission.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}
  createPermission(permission: CreatePermissionRequestDto) {
    return this.permissionRepository.save(permission);
  }
  async getPermissions(ids?: string[]): Promise<PermissionDTO[]> {
    return await this.permissionRepository.find(ids);
  }
  async getAllPermission(pageOptionsDto?: PageOptionsDto,): Promise<PageDto<PermissionDTO>>{
    const [items,count] = await this.permissionRepository.findWithOptions(pageOptionsDto);
    const pageMetaDto = new PageMetaDto({ itemCount: count, pageOptionsDto });
    return new PageDto(items, pageMetaDto);
  }
  getPermissionById(id: string) {
    return this.permissionRepository.findOne(id);
  }
  getPermissionsOfUser(id: string) {
    return this.permissionRepository.getPermissionsOfUser(id);
  }
  async updatePermission(id: string, permission: CreatePermissionRequestDto) {
    const permissionToUpdate = await this.permissionRepository.findOne(id);
    if (!permissionToUpdate) {
      throw new Error('Permission not found');
    }
    return this.permissionRepository.update(id, permission);
  }
  deletePermission(id: string) {
    return this.permissionRepository.softDelete(id);
  }
}