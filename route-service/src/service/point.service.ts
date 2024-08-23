import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Point } from "src/entity/point";
import { CreatePointDTO, UpdatePointDTO } from "src/interface/request";
import { Repository } from "typeorm";


@Injectable()
export class PointService {
    constructor(
        @InjectRepository(Point)
        private readonly pointRepository: Repository<Point>,
    ){}

    async save(createPointDTO: CreatePointDTO): Promise<CreatePointDTO> {
        const savedPoint = await this.pointRepository.save(createPointDTO);
        return plainToInstance(CreatePointDTO, savedPoint);
    }

    async findAllPoint(): Promise<CreatePointDTO[]> {
        const points = await this.pointRepository.find();
        return plainToInstance(CreatePointDTO, points);
    }

    async findOne(id: string): Promise<CreatePointDTO> {
        const point = await this.pointRepository.findOne({ where: { id } });
        if (!point) {
            throw new NotFoundException('Point not found');
        }
        return plainToInstance(CreatePointDTO, point);
    }

    async updatePoint(id: string, updatePointDto: UpdatePointDTO): Promise<UpdatePointDTO> {
        const point = await this.findOne(id);
        Object.assign(point, updatePointDto);
        const updatedPoint = await this.pointRepository.save(point);
        return plainToInstance(UpdatePointDTO, updatedPoint);
    }

    async removePoint(id: string): Promise<void> {
        const point = await this.findOne(id);
        await this.pointRepository.remove(point as Point);
    }

}