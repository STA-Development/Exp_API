import { Inject, Injectable } from "@nestjs/common";
import { CreateSubCriteriaDto } from "../dto/subCriteriaCreateDto";
import { UpdateSubCriteriaDto } from "../dto/subCriteriaUpdateDto";
import { SubCriteria } from "../entity/subCriteria";
import { SubCriteriaRepository } from "../repository/subCriteriaRepository";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../users/entity/user";
import * as dayjs from "dayjs";


@Injectable()
export class SubCriteriaService {

  @Inject()
  subCriteriaRepository: SubCriteriaRepository;

  async create(createSubCriteriaDto: CreateSubCriteriaDto) {
    const subCriteria = await this.subCriteriaRepository.create(createSubCriteriaDto);
    return this.subCriteriaRepository.create(subCriteria);
  }

  async findAll(): Promise<SubCriteria[]> {
    return this.subCriteriaRepository.findAll();
  }

  async findOneById(id: number): Promise<SubCriteria> {
    return this.subCriteriaRepository.findOneById(id);
  }

  update(id: number, updateCriteriaDto: UpdateSubCriteriaDto): Promise<SubCriteria> {
    return this.subCriteriaRepository.update(id, updateCriteriaDto);
  }

  remove(id: number): Promise<SubCriteria> {
    return this.subCriteriaRepository.remove(id);
  }


}
