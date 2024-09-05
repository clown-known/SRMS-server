import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./profile";
import { Roles } from "./role";
import { AuthenticationCode } from "./authentication_code";
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
    refreshToken :string;
    
    @Column({
        nullable:true
    })
    roleId :string;

    @ManyToOne(() => Roles, role => role.accounts)
    role :Roles;

    @Column({
        nullable:true
    })
    profileId?: string;

    @OneToOne(() => Profile, profile => profile.account)
    @JoinColumn()
    profile: Profile;
} 