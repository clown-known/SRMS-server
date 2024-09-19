import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Point } from "../../entity";
import { Like, Repository } from "typeorm";
import { CreatePointDTO } from "./dto/request/create-point.dto";
import { PointDTO } from "./dto/point.dto";
import { UpdatePointDTO } from "./dto/request/update-point.dto";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";


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

    async findAll(pageOptionsDto: PageOptionsDto): Promise<{ data: PointDTO[]; meta: PageMetaDto }> { 
        const [points, itemCount] = await this.pointRepository.findAndCount({
            where: {
                name: Like(`%${pageOptionsDto.searchKey}%`),
            },
            take: pageOptionsDto.take,
            skip: pageOptionsDto.skip,
            order: {
                [pageOptionsDto.orderBy || 'name']: pageOptionsDto.order,
            },
        });

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount,
        });

        return {
            data: plainToInstance(PointDTO, points),
            meta: pageMetaDto,
        };
    }

    async findOne(id: string): Promise<PointDTO> {
        const point = await this.pointRepository.findOne({ where: { id } });
        if (!point) {
            throw new NotFoundException('Point not found');
        }
        return plainToInstance(PointDTO, point);
    }

    async updatePoint(id: string, updatePointDto: UpdatePointDTO): Promise<UpdatePointDTO> {
        const point = await this.findOne(id);
        if (!point) { 
            throw new NotFoundException('Point not found');
        }
        Object.assign(point, updatePointDto);
        const updatedPoint = await this.pointRepository.save(point);
        return plainToInstance(UpdatePointDTO, updatedPoint);
    }

    async removePoint(id: string): Promise<void> {
        const point = await this.pointRepository.findOne({ where: { id } });
        if (!point) { 
            throw new NotFoundException('Point not found');
        }
        await this.pointRepository.remove(point);
    }

}