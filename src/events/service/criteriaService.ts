import { Inject, Injectable } from "@nestjs/common";
import { CreateCriteriaDto } from "../dto/criteriaCreateDto";
import { UpdateCriteriaDto } from "../dto/criteriaUpdateDto";
import { Criteria } from "../entity/criteria";
import { CriteriaRepository } from "../repository/criteriaRepository";

@Injectable()
export class CriteriaService {
  @Inject()
  criteriaRepository: CriteriaRepository;

  async create(createCriteriaDto: CreateCriteriaDto) {
    return this.criteriaRepository.create(createCriteriaDto);
  }

  async findAll(): Promise<Criteria[]> {
    return this.criteriaRepository.findAll();
  }

  findOneById(id: number): Promise<Criteria> {
    return this.criteriaRepository.findOneById(id);
  }

  update(id: number, updateCriteriaDto: UpdateCriteriaDto): Promise<Criteria> {
    return this.criteriaRepository.update(id, updateCriteriaDto);
  }

  remove(id: number): Promise<Criteria> {
    return this.criteriaRepository.remove(id);
  }
}
