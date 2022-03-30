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
} from "@nestjs/common";
import { CriteriaService } from "../service/criteriaService";
import { CreateCriteriaDto } from "../dto/criteriaCreateDto";
import { UpdateCriteriaDto } from "../dto/criteriaUpdateDto";
import { Criteria } from "../entity/criteria";
import { criteriaGetDto } from "../dto/criteriaGetDto";
import {SubCriteriaRefDto} from "../dto/subCriteriaRefDto";

@Controller("criteria")
export class CriteriaController {
  @Inject()
  criteriaService: CriteriaService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(":id/subCriteria")
  addSubCriteria(
      @Param("id") CriteriaId: number,
      @Body() criteriaRef: SubCriteriaRefDto
  ): Promise<Criteria> {
    return this.criteriaService.addSubCriteria(CriteriaId, criteriaRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createCriteriaDto: CreateCriteriaDto): Promise<Criteria> {
    return this.criteriaService.create(createCriteriaDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<Criteria[]> {
    return ( await this.criteriaService.findAll()).map((criteria) => criteriaGetDto(criteria));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(":id")
  async findOneById(@Param("id") id: number): Promise<Criteria> {
    return criteriaGetDto(await this.criteriaService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateCriteriaDto: UpdateCriteriaDto
  ): Promise<Criteria> {
    return this.criteriaService.update(id, updateCriteriaDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(":id")
  remove(@Param("id") id: number): Promise<Criteria> {
    return this.criteriaService.remove(id);
  }
}
