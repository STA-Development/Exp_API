import { Injectable } from "@nestjs/common";
import { CreateRatingDto } from "../dto/ratingCreateDto";
import { UpdateSubCriteriaDto } from "../dto/subCriteriaUpdateDto";
import { SubCriteria } from "../entity/subCriteria";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Rating} from "../entity/rating";
import {UpdateRatingDto} from "../dto/ratingUpdateDto";

@Injectable()
export class RatingRepository {

    @InjectRepository(Rating)
    ratingRepository: Repository<Rating>;

    create(createRatingDto: CreateRatingDto): Promise<Rating> {
        const rating = this.ratingRepository.create(createRatingDto);       // event@ animast popoxakan chi?
        return this.ratingRepository.save(rating);
    }

    findAll(): Promise<Rating[]> {
        return this.ratingRepository.find({ relations: ["events"] });
    }

    async findOneById(id: number): Promise<Rating> {
        const rating = await this.ratingRepository.findOne(id, {
            relations: ["events"],
        });
        return rating;
    }

    async update(eventId: number, updateRatingDto: UpdateRatingDto): Promise<Rating> {

        const rating = await this.ratingRepository.preload({
            id: eventId,
            ...updateRatingDto,
        });

        return this.ratingRepository.save(rating);
    }

    async remove(id: number): Promise<Rating> {

        const rating = await this.findOneById(id);
        return this.ratingRepository.remove(rating);
    }
}
