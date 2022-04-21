import {Inject, Injectable} from '@nestjs/common'
import {CreateCriteriaDto} from '../dto/criteriaCreateDto'
import {UpdateCriteriaDto} from '../dto/criteriaUpdateDto'
import {Criteria} from '../entity/criteria'
import {CriteriaRepository} from '../repository/criteriaRepository'
import {elementIdDto} from '../dto/elementIdDto'
import {SubCriteriaRepository} from '../repository/subCriteriaRepository'

@Injectable()
export class CriteriaService {
  @Inject()
  criteriaRepository: CriteriaRepository

  @Inject()
  subCriteriaRepository: SubCriteriaRepository

  async addSubCriteria(eventId: number, criteriaRef: elementIdDto) {
    const subCriteria = await this.subCriteriaRepository.findOneById(criteriaRef.id)
    const criteria = await this.criteriaRepository.findOneById(eventId)
    !criteria?.subCriteria
      ? (criteria.subCriteria = [subCriteria])
      : criteria.subCriteria.push(subCriteria)
    return this.criteriaRepository.addSubCriteria(criteria)
  }

  async create(createCriteriaDto: CreateCriteriaDto) {
    return this.criteriaRepository.create(createCriteriaDto)
  }

  async findAll(): Promise<Criteria[]> {
    return this.criteriaRepository.findAll()
  }

  findOneById(id: number): Promise<Criteria> {
    return this.criteriaRepository.findOneById(id)
  }

  update(id: number, updateCriteriaDto: UpdateCriteriaDto): Promise<Criteria> {
    return this.criteriaRepository.update(id, updateCriteriaDto)
  }

  remove(id: number): Promise<Criteria> {
    return this.criteriaRepository.remove(id)
  }
}
