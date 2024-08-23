import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { PointService } from "./service/point.service";
import { CreatePointDTO, UpdatePointDTO } from "./interface/request";
import { Point } from "./entity/point";
import { plainToInstance } from "class-transformer";


@Controller('points')
export class PointController {
    constructor(private readonly pointService: PointService) {}

    @Post()
    async create(@Body() createPoint: CreatePointDTO): Promise<CreatePointDTO> {
        return this.pointService.save(createPoint);
    }

    @Get()
    async findAll(): Promise<CreatePointDTO[]> {
        const points = await this.pointService.findAllPoint();
        return points.map(point => plainToInstance(CreatePointDTO, point));
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<CreatePointDTO> {
        const point = await this.pointService.findOne(id);
        return plainToInstance(CreatePointDTO, point);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updatePoint: UpdatePointDTO): Promise<CreatePointDTO> {
        const updatedPoint = await this.pointService.updatePoint(id, updatePoint);
        return plainToInstance(CreatePointDTO, updatedPoint);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.pointService.removePoint(id);
    }

}