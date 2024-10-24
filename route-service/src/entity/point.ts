import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Route } from './route';

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

    @OneToMany(() => Route, (route) => route.startPoint, { cascade: true })
    startRoutes: Route[];

    @OneToMany(() => Route, (route) => route.endPoint, { cascade: true })
    endRoutes: Route[];
}
    