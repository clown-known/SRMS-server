import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from '../entity';

@Entity()
export class Route extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Point, (point) => point.id, { nullable: false })
    @JoinColumn({ name: 'start_point_id' })
    startPoint: Point;

    @ManyToOne(() => Point, (point) => point.id, { nullable: false })
    @JoinColumn({ name: 'end_point_id' })
    endPoint: Point;
}
