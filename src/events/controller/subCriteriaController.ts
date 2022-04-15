import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Inject,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { SubCriteriaService } from '../service/subCriteriaService';
import { CreateSubCriteriaDto } from '../dto/subCriteriaCreateDto';
import { UpdateSubCriteriaDto } from '../dto/subCriteriaUpdateDto';
import { SubCriteria, SubCriteriaPivotDto } from '../entity/subCriteria';
import { subCriteriaGetDto } from '../dto/subCriteriaGetDto';

@Controller('subCriteria')
export class SubCriteriaController {
  @Inject()
  subCriteriaService: SubCriteriaService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(
    @Body() createCriteriaDto: CreateSubCriteriaDto
  ): Promise<SubCriteria> {
    return this.subCriteriaService.create(createCriteriaDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<SubCriteriaPivotDto[]> {
    return (await this.subCriteriaService.findAll()).map((subCriteria) =>
      subCriteriaGetDto(subCriteria)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<SubCriteriaPivotDto> {
    return subCriteriaGetDto(await this.subCriteriaService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCriteriaDto: UpdateSubCriteriaDto
  ): Promise<SubCriteria> {
    return this.subCriteriaService.update(id, updateCriteriaDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<SubCriteria> {
    return this.subCriteriaService.remove(id);
  }
}
