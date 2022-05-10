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
  ClassSerializerInterceptor,
} from '@nestjs/common'
import {SubCriteriaService} from '../service/subCriteriaService'
import {CreateSubCriteriaDto} from '../dto/subCriteriaCreateDto'
import {UpdateSubCriteriaDto} from '../dto/subCriteriaUpdateDto'
import {SubCriteria, SubCriteriaDto} from '../entity/subCriteria'
import {subCriteriaGetDto} from '../dto/subCriteriaGetDto'
import {CriteriaService} from '../service/criteriaService'

@Controller('subCriteria')
export class SubCriteriaController {
  @Inject()
  subCriteriaService: SubCriteriaService

  @Inject()
  criteriaService: CriteriaService

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':id')
  async create(@Body() createCriteriaDto: CreateSubCriteriaDto): Promise<SubCriteria> {
    const subCriteria = await this.subCriteriaService.create(createCriteriaDto)
    await this.criteriaService.addSubCriteria(createCriteriaDto.criteriaId, subCriteria.id)
    return subCriteria
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(): Promise<SubCriteriaDto[]> {
    return this.subCriteriaService.findAll()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<SubCriteriaDto> {
    return subCriteriaGetDto(await this.subCriteriaService.findOneById(id))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCriteriaDto: UpdateSubCriteriaDto,
  ): Promise<SubCriteria> {
    return this.subCriteriaService.update(id, updateCriteriaDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<SubCriteria> {
    return this.subCriteriaService.remove(id)
  }
}
