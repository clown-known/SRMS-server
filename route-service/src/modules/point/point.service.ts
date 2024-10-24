import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { Point } from "../../entity";
import { ILike, Repository } from "typeorm";
import { CreatePointDTO } from "./dto/request/create-point.dto";
import { PointDTO } from "./dto/point.dto";
import { UpdatePointDTO } from "./dto/request/update-point.dto";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";
import { PageDto } from "src/common/pagination/page.dto";

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

    async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<PointDTO>> {
        const allPoints = await this.pointRepository.find({
            where: {
                name: ILike(`%${pageOptionsDto.searchKey}%`),
            },
            order: {
                [pageOptionsDto.orderBy || 'name']: pageOptionsDto.order,
            },
        });

        const itemCount = allPoints.length;

        const start = pageOptionsDto.skip;
        const end = start + pageOptionsDto.take;
        const paginatedPoints = allPoints.slice(start, end);

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount,
        });

        return new PageDto(
            plainToInstance(PointDTO, paginatedPoints),
            pageMetaDto
        );
    }

    async findAllWithoutPagination(): Promise<PointDTO[]> {
        const points = await this.pointRepository.find({
            order: {
                name: 'ASC'
            }
        });
        return plainToInstance(PointDTO, points);
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