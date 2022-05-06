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
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common'
import {Request} from 'express'
import {EventsService} from '../service/eventService'
import {CreateEventDto} from '../dto/eventCreateDto'
import {UpdateEventDto} from '../dto/eventUpdateDto'
import {Event, EventDto} from '../entity/event'
import {eventGetDto} from '../dto/eventGetDto'
import {User} from '../../users/entity/user'
import {IEventSearch} from '../interface/eventSearchInterface'
import {ISubCriteriaRef} from '../interface/subCriteriaRefInterface'

@Controller('events')
export class EventsController {
  @Inject()
  eventsService: EventsService

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('search')
  async search(@Req() req: Request): Promise<EventDto[]> {
    const params: IEventSearch = {...req.query}
    return (await this.eventsService.search(params)).map((event) => eventGetDto(event))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('ongoing')
  getOngoingEvents(): Promise<Event[]> {
    return this.eventsService.getOngoingEvents()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<EventDto[]> {
    return (await this.eventsService.findAll()).map((event) => eventGetDto(event))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/userRating')
  getUserRating(@Param('id') eventId: number): Promise<User[]> {
    return this.eventsService.getUserRating(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<EventDto> {
    return eventGetDto(await this.eventsService.findOneById(id))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<EventDto> {
    return this.eventsService.create(createEventDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/rating')
  addRating(@Param('id') eventId: number, @Body() ratingId: number): Promise<Event> {
    return this.eventsService.addRating(eventId, ratingId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/criteria')
  addCriteria(@Param('id') eventId: number, @Body() criteriaId: number): Promise<Event> {
    return this.eventsService.addCriteria(eventId, criteriaId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/subCriteria')
  addSubCriteria(
    @Param('id') eventId: number,
    @Body() criteriaRef: ISubCriteriaRef,
  ): Promise<void> {
    return this.eventsService.addSubCriteria(eventId, criteriaRef)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/evaluator')
  addEvaluators(@Param('id') eventId: number, @Body() userId: number): void {
    this.eventsService.addEvaluators(eventId, userId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/evaluatee')
  addEvaluatees(@Param('id') eventId: number, @Body() userId: number): void {
    this.eventsService.addEvaluatees(eventId, userId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventsService.update(id, updateEventDto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<Event> {
    return this.eventsService.remove(id)
  }
}
