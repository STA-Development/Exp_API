import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CreateRatingDto} from '../dto/ratingCreateDto'
import {Rating} from '../entity/rating'
import {UpdateRatingDto} from '../dto/ratingUpdateDto'

@Injectable()
export class RatingRepository {
  @InjectRepository(Rating)
  ratingRepository: Repository<Rating>

  async create(createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingRepository.save(createRatingDto)
  }

  findAll(): Promise<Rating[]> {
    return this.ratingRepository.find(/* { relations: ['pivot', 'pivot.event'] } */)
  }

  async findOneById(id: number): Promise<Rating> {
    const rating = await this.ratingRepository.findOne(id, {
      // relations: ['pivot', 'pivot.event']
    })
    return rating
  }

  async update(eventId: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingRepository.preload({
      id: eventId,
      ...updateRatingDto,
    })

    return this.ratingRepository.save(rating)
  }

  async remove(id: number): Promise<Rating> {
    const rating = await this.findOneById(id)
    return this.ratingRepository.remove(rating)
  }
}
