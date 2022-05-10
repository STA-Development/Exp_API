import {Inject, Injectable} from '@nestjs/common'
import {CreateSubCriteriaDto} from '../dto/subCriteriaCreateDto'
import {UpdateSubCriteriaDto} from '../dto/subCriteriaUpdateDto'
import {SubCriteria} from '../entity/subCriteria'
import {SubCriteriaRepository} from '../repository/subCriteriaRepository'

@Injectable()
export class SubCriteriaService {
  @Inject()
  subCriteriaRepository: SubCriteriaRepository

  create(createSubCriteriaDto: CreateSubCriteriaDto) {
    return this.subCriteriaRepository.create(createSubCriteriaDto)
  }

  findAll(): Promise<SubCriteria[]> {
    return this.subCriteriaRepository.findAll()
  }

  findOneById(id: number): Promise<SubCriteria> {
    return this.subCriteriaRepository.findOneById(id)
  }

  update(id: number, updateCriteriaDto: UpdateSubCriteriaDto): Promise<SubCriteria> {
    return this.subCriteriaRepository.update(id, updateCriteriaDto)
  }

  remove(id: number): Promise<SubCriteria> {
    return this.subCriteriaRepository.remove(id)
  }
}
