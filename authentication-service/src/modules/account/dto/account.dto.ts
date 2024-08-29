
import { Expose, Type } from "class-transformer";
import { ProfileDTO } from "src/modules/profile/dto/profile.dto";
import { RoleDTO } from "src/modules/role/dto/role.dto";

export class AccountDTO{
    @Expose()
    email :string;
    @Expose()
    role? : RoleDTO;

    @Expose()
    @Type(() => ProfileDTO)
    profile?: ProfileDTO;
}