import { BaseEntity } from "src/common/base.entity";

export class Permission extends BaseEntity{

    module: string;

    action: string;
}