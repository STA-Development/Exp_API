import { Inject, Injectable } from "@nestjs/common";
import { CreateCriteriaDto } from "../dto/criteriaCreateDto";
import { UpdateCriteriaDto } from "../dto/criteriaUpdateDto";
import { Criteria } from "../entity/criteria";
import { CriteriaRepository } from "../repository/criteriaRepository";
import {IIdRefDto} from "../interface/subCriteriaRefInterface";
import {SubCriteriaRepository} from "../repository/subCriteriaRepository";
import {logger} from "../../logger";


@Injectable()
export class CriteriaService {

  @Inject()
  criteriaRepository: CriteriaRepository;

  @Inject()
  subCriteriaRepository: SubCriteriaRepository;

  async addSubCriteria(criteriaId: number, criteriaRef: IIdRefDto) {
    const subCriteria = await this.subCriteriaRepository.findOneById(criteriaRef.id)
    const criteria = await this.criteriaRepository.findOneById(criteriaId)
    if (criteria.subCriteria === null) {
      criteria.subCriteria = [subCriteria]
      logger.error(`${(criteria)} `);

    } else {
      console.log({subCriteria})
      logger.info(`adding new subcriteria to ${(criteria.name)} criteria`);
      console.log({criteria})
      criteria.subCriteria.push(subCriteria)
      console.log({criteria})
    }
    return this.criteriaRepository.addSubCriteria(criteria)
  }

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
