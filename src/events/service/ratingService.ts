import {Inject, Injectable} from '@nestjs/common';
import {Rating} from '../entity/rating';
import {RatingRepository} from '../repository/ratingRepository';
import {CreateRatingDto} from '../dto/ratingCreateDto';
import {UpdateRatingDto} from '../dto/ratingUpdateDto';


@Injectable()
export class RatingService {
    @Inject()
      ratingRepository: RatingRepository;

    async create(createRatingDto: CreateRatingDto) {
      const rating = await this.ratingRepository.create(createRatingDto);
      return this.ratingRepository.create(rating);
    }

    async findAll(): Promise<Rating[]> {
      return this.ratingRepository.findAll();
    }

    async findOneById(id: number): Promise<Rating> {
      return this.ratingRepository.findOneById(id);
    }

    update(id: number, updateCriteriaDto: UpdateRatingDto): Promise<Rating> {
      return this.ratingRepository.update(id, updateCriteriaDto);
    }

    remove(id: number): Promise<Rating> {
      return this.ratingRepository.remove(id);
    }
}
