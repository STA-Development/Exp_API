import {PartialType} from '@nestjs/mapped-types';
import {CreateRatingDto} from './ratingCreateDto';

export class UpdateRatingDto extends PartialType(CreateRatingDto) {}
