import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile";
import { Roles } from "./role";
@Entity()
export class Account extends BaseEntity{

    @Column()
    password :string;


    @Column()
    email :string;

    @Column({
        default:false
    })
    active :boolean;

    @Column({
        nullable:true
    })

    @Column({
        nullable:true
    })
    refreshToken :string;

    roleId :string;

    @ManyToOne(() => Roles, role => role.accounts)
    role :Roles;
}