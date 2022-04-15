import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Inject,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { EventsService } from '../service/eventService';
import { CreateEventDto } from '../dto/eventCreateDto';
import { UpdateEventDto } from '../dto/eventUpdateDto';
import { Event, EventPivotDto } from '../entity/event';
import { eventGetDto } from '../dto/eventGetDto';
import { elementIdDto } from '../dto/elementIdDto';
import { SubCriteriaIdRefDto } from '../dto/subCriteriaIdRefDto';
import { Period } from '../interface/eventInterface';
import { logger } from '../../logger';
import { User } from '../../users/entity/user';

@Controller('events')
export class EventsController {
  @Inject()
  eventsService: EventsService;

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/ongoing')
  ongoing(): Promise<Event[]> {
    return this.eventsService.ongoing();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/userRating')
  async getUserRating(@Param('id') eventId: number): Promise<User[]> {
    return this.eventsService.getUserRating(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/rating')
  addRating(
    @Param('id') eventId: number,
    @Body() ratingRef: elementIdDto
  ): Promise<Event> {
    return this.eventsService.addRating(eventId, ratingRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/criteria')
  addCriteria(
    @Param('id') eventId: number,
    @Body() criteriaRef: elementIdDto
  ): Promise<Event> {
    return this.eventsService.addCriteria(eventId, criteriaRef);
  }

  @UseInterceptors(ClassSerializerInterceptor) //TODO pivotov te sovorakan manytomany ov?
  @Put(':id/subCriteria')
  addSubCriteria(
    @Param('id') eventId: number,
    @Body() criteriaRef: SubCriteriaIdRefDto
  ): Promise<void> {
    return this.eventsService.addSubCriteria(eventId, criteriaRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/user')
  addUsers(
    @Param('id') eventId: number,
    @Body() userRef: elementIdDto
  ): Promise<Event> {
    return this.eventsService.addUsers(eventId, userRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<EventPivotDto[]> {
    return (await this.eventsService.findAll()).map((event) =>
      eventGetDto(event)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/allByTitle/:title')
  async findAllByTitle(
    @Param('title') title: string
  ): Promise<EventPivotDto[]> {
    return (await this.eventsService.findAllByTitle(title)).map((event) =>
      eventGetDto(event)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<EventPivotDto> {
    return eventGetDto(await this.eventsService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byTitle/:title')
  async findOneByTitle(@Param('title') title: string): Promise<EventPivotDto> {
    return eventGetDto(await this.eventsService.findOneByTitle(title));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/byTimePeriod/:timePeriod')
  async findOneByTimePeriod(
    @Param('TimePeriod') timePeriod: Period
  ): Promise<EventPivotDto> {
    return eventGetDto(
      await this.eventsService.findOneByTimePeriod(timePeriod)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto
  ): Promise<Event> {
    return this.eventsService.update(id, updateEventDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Event> {
    return this.eventsService.remove(id);
  }
}
