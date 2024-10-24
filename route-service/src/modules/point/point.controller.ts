import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PointService } from './point.service';
import { plainToInstance } from 'class-transformer';
import { CreatePointDTO } from './dto/request/create-point.dto';
import { UpdatePointDTO } from './dto/request/update-point.dto';
import { PageOptionsDto } from 'src/common/pagination/page-option.dto';
import { PageDto } from 'src/common/pagination/page.dto';
import { PointDTO } from './dto/point.dto';
import { PermissionsGuard } from 'src/guards/permission.guard';
import { Actions, Modules } from 'src/common/enum';
import { Permissions } from 'src/decorator/permission.decorator';

@Controller('points')
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get('all')
  async findAllWithoutPagination(): Promise<PointDTO[]> {
    return this.pointService.findAllWithoutPagination();
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions([
      {module: Modules.ROUTE, action: Actions.CREATE},
  ])
  async create(@Body() createPoint: CreatePointDTO): Promise<CreatePointDTO> {
    return this.pointService.save(createPoint);
  }

  @Get()
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PointDTO>> {
    return this.pointService.findAll(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CreatePointDTO> {
    const point = await this.pointService.findOne(id);
    return plainToInstance(CreatePointDTO, point);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions([
      {module: Modules.ROUTE, action: Actions.UPDATE},
  ])
  async update(
    @Param('id') id: string,
    @Body() updatePoint: UpdatePointDTO,
  ): Promise<CreatePointDTO> {
    const updatedPoint = await this.pointService.updatePoint(id, updatePoint);
    return plainToInstance(CreatePointDTO, updatedPoint);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions([
      {module: Modules.ROUTE, action: Actions.DELETE},
  ])
  async remove(@Param('id') id: string): Promise<void> {
    return this.pointService.removePoint(id);
  }
}
