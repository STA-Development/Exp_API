import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CreateCriteriaDto} from '../dto/criteriaCreateDto'
import {UpdateCriteriaDto} from '../dto/criteriaUpdateDto'
import {Criteria} from '../entity/criteria'

@Injectable()
export class CriteriaRepository {
  @InjectRepository(Criteria)
  criteriaRepository: Repository<Criteria>

  addSubCriteria(criteria: Criteria) {
    return this.criteriaRepository.save(criteria)
  }

  create(createCriteriaDto: CreateCriteriaDto): Promise<Criteria> {
    return this.criteriaRepository.save(createCriteriaDto)
  }

  findAll(): Promise<Criteria[]> {
    return this.criteriaRepository.find({
      relations: ['subCriteria'],
    })
  }

  async findOneById(id: number): Promise<Criteria> {
    const criteria = await this.criteriaRepository.findOne(id, {
      relations: ['subCriteria'],
    })
    return criteria
  }

  async update(criteriaId: number, updateCriteriaDto: UpdateCriteriaDto): Promise<Criteria> {
    const criteria = await this.criteriaRepository.preload({
      id: criteriaId,
      ...updateCriteriaDto,
    })

    return this.criteriaRepository.save(criteria)
  }

  async remove(id: number): Promise<Criteria> {
    const criteria = await this.findOneById(id)
    return this.criteriaRepository.remove(criteria)
  }
}
