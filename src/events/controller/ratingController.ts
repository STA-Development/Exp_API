import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common'
import {ApiOkResponse} from '@nestjs/swagger'
import {RatingService} from '../service/ratingService'
import {CreateRatingDto} from '../dto/ratingCreateDto'
import {Rating, RatingDto} from '../entity/rating'
import {ratingGetDto} from '../dto/ratingGetDto'
import {UpdateRatingDto} from '../dto/ratingUpdateDto'

@Controller('rating')
export class RatingController {
  @Inject()
  ratingService: RatingService

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createRatingDto: CreateRatingDto): Promise<Rating> {
    return this.ratingService.create(createRatingDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [RatingDto]})
  @Get()
  async findAll(): Promise<RatingDto[]> {
    return (await this.ratingService.findAll()).map((rating) => ratingGetDto(rating))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [RatingDto]})
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<RatingDto> {
    return ratingGetDto(await this.ratingService.findOneById(id))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateRatingDto: UpdateRatingDto): Promise<Rating> {
    return this.ratingService.update(id, updateRatingDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Rating> {
    return this.ratingService.remove(id)
  }
}
