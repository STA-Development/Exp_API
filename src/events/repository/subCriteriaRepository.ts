import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CreateSubCriteriaDto} from '../dto/subCriteriaCreateDto'
import {UpdateSubCriteriaDto} from '../dto/subCriteriaUpdateDto'
import {SubCriteria} from '../entity/subCriteria'

@Injectable()
export class SubCriteriaRepository {
  @InjectRepository(SubCriteria)
  subCriteriaRepository: Repository<SubCriteria>

  findAll(): Promise<SubCriteria[]> {
    return this.subCriteriaRepository.find({
      relations: ['criterias'],
    })
  }

  async findOneById(id: number): Promise<SubCriteria> {
    const subCriteria = await this.subCriteriaRepository.findOne(id, {
      relations: ['criterias'],
    })
    return subCriteria
  }

  create(createSubCriteriaDto: CreateSubCriteriaDto): Promise<SubCriteria> {
    return this.subCriteriaRepository.save(this.subCriteriaRepository.create(createSubCriteriaDto))
  }

  async update(eventId: number, updateSubCriteriaDto: UpdateSubCriteriaDto): Promise<SubCriteria> {
    const criteria = await this.subCriteriaRepository.preload({
      id: eventId,
      ...updateSubCriteriaDto,
    })

    return this.subCriteriaRepository.save(criteria)
  }

  async remove(id: number): Promise<SubCriteria> {
    const subCriteria = await this.findOneById(id)
    return this.subCriteriaRepository.remove(subCriteria)
  }
}
