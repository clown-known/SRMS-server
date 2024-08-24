import { Injectable } from "@nestjs/common";
import { PermissionRepository } from "./permission.repository";
import { CreatePermissionRequestDto } from "./dto";

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}
  createPermission(permission: CreatePermissionRequestDto) {
    return this.permissionRepository.save(permission);
  }
  getPermissions(ids?: string[]) {
    return this.permissionRepository.find(ids);
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