import { CreatePermissionRequestDto } from "src/inteface/permission";
import { PermissionRepository } from "src/repository";

export class PermissionService {
  constructor(
    private readonly permissionRepository: PermissionRepository,
  ) {}
  createPermission(permission: CreatePermissionRequestDto) {
    return this.permissionRepository.save(permission);
  }
}