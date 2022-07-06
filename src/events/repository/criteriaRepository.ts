import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { CreateCriteriaDto } from '../dto/criteriaCreateDto';
import { UpdateCriteriaDto } from '../dto/criteriaUpdateDto';
import { Criteria } from '../entity/criteria';
import { SubCriteria } from '../entity/subCriteria';
import { SubCriteriaRepository } from './subCriteriaRepository';

@Injectable()
export class CriteriaRepository {
  @InjectRepository(Criteria)
  criteriaRepository: Repository<Criteria>;

  @Inject()
  subCriteriaRepository: SubCriteriaRepository;

  async addSubCriteria(criteriaId: number, idRef: number[]): Promise<Criteria> {
    const subCriterias: SubCriteria[] = [];
    for (let i = 0; i < idRef.length; i++) {
      subCriterias.push(await this.subCriteriaRepository.findOneById(idRef[i]));
    }
    const criteria = await this.criteriaRepository.findOne(criteriaId);
    if (!criteria?.subCriteria) {
      criteria.subCriteria = subCriterias;
    } else {
      criteria.subCriteria.push(...subCriterias);
    }

    return this.criteriaRepository.save(criteria);
  }

  create(createCriteriaDto: CreateCriteriaDto): Promise<Criteria> {
    return this.criteriaRepository.save(createCriteriaDto);
  }

  findAll(): Promise<Criteria[]> {
    return this.criteriaRepository.find({
      relations: ['subCriteria']
    });
  }

  async findOneById(id: number): Promise<Criteria> {
    const criteria = await this.criteriaRepository.findOne(id, {
      relations: ['subCriteria']
    });
    return criteria;
  }

  async update(
    criteriaId: number,
    updateCriteriaDto: UpdateCriteriaDto
  ): Promise<Criteria> {
    const criteria = await this.criteriaRepository.preload({
      id: criteriaId,
      ...updateCriteriaDto
    });

    return this.criteriaRepository.save(criteria);
  }

  async remove(id: number): Promise<Criteria> {
    return this.criteriaRepository.remove(await this.findOneById(id));
  }
}
