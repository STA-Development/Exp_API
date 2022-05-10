import {Inject, Injectable} from '@nestjs/common'
import {Rating} from '../entity/rating'
import {RatingRepository} from '../repository/ratingRepository'
import {CreateRatingDto} from '../dto/ratingCreateDto'
import {UpdateRatingDto} from '../dto/ratingUpdateDto'

@Injectable()
export class RatingService {
  @Inject()
  ratingRepository: RatingRepository

  async create(createRatingDto: CreateRatingDto) {
    return this.ratingRepository.create(await this.ratingRepository.create(createRatingDto))
  }

  findAll(): Promise<Rating[]> {
    return this.ratingRepository.findAll()
  }

  findOneById(id: number): Promise<Rating> {
    return this.ratingRepository.findOneById(id)
  }

  update(id: number, updateCriteriaDto: UpdateRatingDto): Promise<Rating> {
    return this.ratingRepository.update(id, updateCriteriaDto)
  }

  remove(id: number): Promise<Rating> {
    return this.ratingRepository.remove(id)
  }
}
