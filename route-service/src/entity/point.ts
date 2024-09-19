import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Point extends BaseEntity {

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column('float')
    latitude: number;

    @Column('float')
    longitude: number;
}
    