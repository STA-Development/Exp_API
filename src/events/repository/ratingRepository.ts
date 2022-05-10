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

  create(createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingRepository.save(createRatingDto)
  }

  findAll(): Promise<Rating[]> {
    return this.ratingRepository.find()
  }

  findOneById(id: number): Promise<Rating> {
    return this.ratingRepository.findOne(id)
  }

  async update(eventId: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {
    const rating = await this.ratingRepository.preload({
      id: eventId,
      ...updateRatingDto,
    })

    return this.ratingRepository.save(rating)
  }

  async remove(id: number): Promise<Rating> {
    return this.ratingRepository.remove(await this.findOneById(id))
  }
}
