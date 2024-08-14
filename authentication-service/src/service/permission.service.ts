import { Injectable } from "@nestjs/common";
import { CreatePermissionRequestDto } from "src/inteface/permission";
import { PermissionRepository } from "src/repository";

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}
  createPermission(permission: CreatePermissionRequestDto) {
    return this.permissionRepository.save(permission);
  }
  getPermissions() {
    return this.permissionRepository.find();
  }
  getPermissionById(id: string) {
    return this.permissionRepository.findOne({ where: { id } });
  }
  getPermissionsOfUser(id: string) {
    return this.permissionRepository.getPermissionsOfUser(id);
  }
  async updatePermission(id: string, permission: CreatePermissionRequestDto) {
    const permissionToUpdate = await this.permissionRepository.findOne({ where: { id } });
    if (!permissionToUpdate) {
      throw new Error('Permission not found');
    }
    return this.permissionRepository.update(id, permission);
  }
  deletePermission(id: string) {
    return this.permissionRepository.softDelete(id);
  }
}