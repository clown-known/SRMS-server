import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'src/entity/point';
import { BaseEntity } from 'src/common/base.entity';


@Entity()
export class Route extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true, type: "float"})
    distance: number;

    @Column({ nullable: true, type: "float" })
    estimatedTime: number;

    @ManyToOne(() => Point, (point) => point.startRoutes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'start_point_id' })
    startPoint: Point;

    @ManyToOne(() => Point, (point) => point.endRoutes, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'end_point_id' })
    endPoint: Point;
}
