import { Roles } from "src/entity/role";
import { RoleRepository } from "src/repository/role.repository";

export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) 
  {}
    async createRole(role: Roles): Promise<Roles> {
        return await this.roleRepository.save(role);
    }
}