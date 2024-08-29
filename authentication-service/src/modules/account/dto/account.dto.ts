import { ProfileDTO } from "src/modules/profile/dto/profile.dto";
import { RoleDTO } from "src/modules/role/dto/role.dto";

export class AccountDTO{
    email :string;
    role? : RoleDTO;
    profile?: ProfileDTO;
}