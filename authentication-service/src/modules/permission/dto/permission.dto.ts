import { Expose } from "class-transformer";

export class PermissionDTO{
    @Expose()
    id: string;
    @Expose()
    module: string;
    @Expose()
    action: string;
}