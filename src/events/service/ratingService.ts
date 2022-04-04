import {Inject, Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "../entity/rating";
import { RatingRepository } from "../repository/ratingRepository";
import { IRating } from "../interface/ratingInterface";
import { Repository } from "typeorm";
import { CreateRatingDto } from "../dto/ratingCreateDto";
import {SubCriteriaRepository} from "../repository/subCriteriaRepository";
import {UpdateRatingDto} from "../dto/ratingUpdateDto";


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
        // return ratingSeeds.map(async (ratingSeed: IRatingSeed) => {
        //     return await this.languageRepository
        //         .findOne({ to: ratingSeed.to })
        //         .exec(   )
        //         .then(async dbLangauge => {
        //             // We check if a language already exists.
        //             // If it does don't create a new one.
        //             if (dbLangauge) {
        //                 return Promise.resolve(null);
        //             }
        //             return Promise.resolve(
        //                 await this.languageRepository.create(language),
        //             );
        //         })
        //         .catch(error => Promise.reject(error));
        // });

