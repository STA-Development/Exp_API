import { Injectable } from "@nestjs/common";
import { CreateSubCriteriaDto } from "../dto/subCriteriaCreateDto";
import { UpdateSubCriteriaDto } from "../dto/subCriteriaUpdateDto";
import { SubCriteria } from "../entity/subCriteria";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class SubCriteriaRepository {
  @InjectRepository(SubCriteria)
  subCriteriaRepository: Repository<SubCriteria>;

  create(createSubCriteriaDto: CreateSubCriteriaDto): Promise<SubCriteria> {
    const subCriteria = this.subCriteriaRepository.create(createSubCriteriaDto); // event@ animast popoxakan chi?
    return this.subCriteriaRepository.save(subCriteria);
  }

  findAll(): Promise<SubCriteria[]> {
    return this.subCriteriaRepository.find({
      relations: ["pivot", "pivot.criteria"],
    });
  }
  async findOneById(id: number): Promise<SubCriteria> {
    const subCriteria = await this.subCriteriaRepository.findOne(id, {
      relations: ["pivot", "pivot.criteria"],
    });
    return subCriteria;
  }

  async update(
    eventId: number,
    updateSubCriteriaDto: UpdateSubCriteriaDto
  ): Promise<SubCriteria> {
    const criteria = await this.subCriteriaRepository.preload({
      id: eventId,
      ...updateSubCriteriaDto,
    });

    return this.subCriteriaRepository.save(criteria);
  }

  async remove(id: number): Promise<SubCriteria> {
    const subCriteria = await this.findOneById(id);
    return this.subCriteriaRepository.remove(subCriteria);
  }
}
