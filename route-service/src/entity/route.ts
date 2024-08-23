import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Point } from "./point";


@Entity()
export class Route extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @ManyToOne(() => Point, (point) => point.id)
    @JoinColumn({ name: 'start_point_id' })
    startPoint: Point;

    @ManyToOne(() => Point, (point) => point.id)
    @JoinColumn({ name: 'end_point_id' })
    endPoint: Point;
}