import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { Point } from "src/entity/point";
import { FindOptionsOrder, ILike, Repository } from "typeorm";
import { PointDTO } from "./dto/point.dto";
import { transformToDTO } from "src/common/transform.util";


@Injectable()
export class PointRepository extends Repository<Point> {
    constructor(
        @InjectRepository(Point)
        private readonly pointRepository: Repository<Point>,
    ) {
        super(pointRepository.target, pointRepository.manager, pointRepository.queryRunner);
    }

    async findWithOption(pageOptionsDto: PageOptionsDto): Promise<PageDto<PointDTO>> {
        const order: FindOptionsOrder<Point> = {
            ...(pageOptionsDto.orderBy ? { [pageOptionsDto.orderBy]: pageOptionsDto.order } : {}),
        };

        const [items, itemCount] = await Promise.all([
            this.pointRepository.find({
                take: pageOptionsDto.take,
                skip: pageOptionsDto.skip,
                order,
                where: {
                    name: ILike(`%${pageOptionsDto.searchKey}%`),
                },
            }),
            this.pointRepository.count({
                where: {
                    name: ILike(`%${pageOptionsDto.searchKey}%`),
                },
            }),
        ]);

        const pageMetaDto = new PageMetaDto({
            pageOptionsDto,
            itemCount,
        });

        const transformedItems = transformToDTO(PointDTO, items);

        return new PageDto(transformedItems, pageMetaDto);
    }
}