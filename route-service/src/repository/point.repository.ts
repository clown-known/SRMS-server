import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Point } from "src/entity/point";
import { Repository } from "typeorm";


@Injectable()
export class PointRepository extends Repository<Point> {
    constructor(
        @InjectRepository(Point)
        private readonly pointRepository: Repository<Point>,
    ) {
        super(pointRepository.target, pointRepository.manager, pointRepository.queryRunner);
    }
}