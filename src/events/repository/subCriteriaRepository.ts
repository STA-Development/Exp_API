import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CreateSubCriteriaDto} from '../dto/subCriteriaCreateDto'
import {UpdateSubCriteriaDto} from '../dto/subCriteriaUpdateDto'
import {SubCriteria} from '../entity/subCriteria'
import {Criteria} from '../entity/criteria'

@Injectable()
export class SubCriteriaRepository {
  @InjectRepository(SubCriteria)
  subCriteriaRepository: Repository<SubCriteria>

  @InjectRepository(Criteria)
  criteriaRepository: Repository<Criteria>

  findAll(): Promise<SubCriteria[]> {
    return this.subCriteriaRepository.find({
      relations: ['criteria'],
    })
  }

  async findOneById(id: number): Promise<SubCriteria> {
    const subCriteria = await this.subCriteriaRepository.findOne(id, {
      relations: ['criteria'],
    })
    return subCriteria
  }

  create(createSubCriteriaDto: CreateSubCriteriaDto): Promise<SubCriteria> {
    return this.subCriteriaRepository.save(createSubCriteriaDto)
  }

  async update(eventId: number, updateSubCriteriaDto: UpdateSubCriteriaDto): Promise<SubCriteria> {
    const criteria = await this.subCriteriaRepository.preload({
      id: eventId,
      ...updateSubCriteriaDto,
    })

    return this.subCriteriaRepository.save(criteria)
  }

  async remove(id: number): Promise<SubCriteria> {
    return this.subCriteriaRepository.remove(await this.findOneById(id))
  }
}
