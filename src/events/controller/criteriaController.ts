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
  Patch
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CriteriaService } from '../service/criteriaService';
import { CreateCriteriaDto } from '../dto/criteriaCreateDto';
import { UpdateCriteriaDto } from '../dto/criteriaUpdateDto';
import { Criteria, CriteriaDto } from '../entity/criteria';
import { criteriaGetDto } from '../dto/criteriaGetDto';
import { ElementDto } from '../dto/elementDto';

@ApiTags('criteria')
@Controller('criteria')
export class CriteriaController {
  @Inject()
  criteriaService: CriteriaService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':criteriaId/subcriteria')
  addSubCriteria(
    @Param('criteriaId') criteriaId: number,
    @Body() subCriteriaRef: ElementDto
  ): Promise<CriteriaDto> {
    return this.criteriaService.addSubCriteria(criteriaId, subCriteriaRef.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [CriteriaDto] })
  @Get()
  async findAll(): Promise<CriteriaDto[]> {
    return (await this.criteriaService.findAll()).map((criteria) =>
      criteriaGetDto(criteria)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [CriteriaDto] })
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<CriteriaDto> {
    const criteria = await this.criteriaService.findOneById(id);
    return criteriaGetDto(criteria);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createCriteriaDto: CreateCriteriaDto): Promise<Criteria> {
    return this.criteriaService.create(createCriteriaDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCriteriaDto: UpdateCriteriaDto
  ): Promise<Criteria> {
    return this.criteriaService.update(id, updateCriteriaDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Criteria> {
    return this.criteriaService.remove(id);
  }
}
