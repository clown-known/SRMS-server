import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PageMetaDto } from "src/common/pagination/page-meta.dto";
import { PageOptionsDto } from "src/common/pagination/page-option.dto";
import { PageDto } from "src/common/pagination/page.dto";
import { Route } from "src/entity/route";
import { FindOptionsOrder, ILike, Repository } from "typeorm";
import { RouteDTO } from "./dto/route.dto";
import { transformToDTO } from "src/common/transform.util";

@Injectable()
export class RouteRepository extends Repository<Route> {
    constructor(
    @InjectRepository(Route)
    private readonly routeRepository: Repository<Route>,
  ) {
    super(routeRepository.target, routeRepository.manager, routeRepository.queryRunner);
  }

  async findWithOption(pageOptionsDto: PageOptionsDto): Promise<PageDto<RouteDTO>> {
    const order: FindOptionsOrder<Route> = {
        ...(pageOptionsDto.orderBy ? { [pageOptionsDto.orderBy]: pageOptionsDto.order } : {}),
    };

    const [items, itemCount] = await Promise.all([
        this.routeRepository.find({
            relations: ['startPoint', 'endPoint'],
            take: pageOptionsDto.take,
            skip: pageOptionsDto.skip,
            order,
            where: [
                { name: ILike(`%${pageOptionsDto.searchKey}%`) },
                { description: ILike(`%${pageOptionsDto.searchKey}%`) },
            ],
        }),
        this.routeRepository.count({
            where: [
                { name: ILike(`%${pageOptionsDto.searchKey}%`) },
                { description: ILike(`%${pageOptionsDto.searchKey}%`) },
            ],
        }),
    ]);

    const pageMetaDto = new PageMetaDto({
        pageOptionsDto,
        itemCount,
    });

    const transformedItems = transformToDTO(RouteDTO, items);

    return new PageDto(transformedItems, pageMetaDto);
  }

}