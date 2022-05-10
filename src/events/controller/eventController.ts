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
  UseGuards,
} from '@nestjs/common'
import {Request} from 'express'
import {JwtService} from '@nestjs/jwt'
import {JwtPayload} from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'
import {EventsService} from '../service/eventService'
import {CreateEventDto} from '../dto/eventCreateDto'
import {UpdateEventDto} from '../dto/eventUpdateDto'
import {Event, EventDto} from '../entity/event'
import {eventGetDto} from '../dto/eventGetDto'
import {User} from '../../users/entity/user'
import {IEventSearch} from '../interface/eventSearchInterface'
import {ISubCriteriaRef} from '../interface/subCriteriaRefInterface'
import {sendEvaluationEmail} from '../../utils/sendEvaluationMail'
import {IEvaluationResult} from '../interface/evaluationResultInterface'
import {ISubmission} from '../interface/submissionInterface'
import {IEventProgress} from '../interface/eventProgress'
import {INotEvaluated} from '../interface/notEvaluatedEvaluators'

@Controller('events')
export class EventsController {
  @Inject()
  eventsService: EventsService

  @Inject()
  jwtService: JwtService

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(): Promise<EventDto[]> {
    return (await this.eventsService.findAll()).map((event) => eventGetDto(event))
  }

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
  @Get(':id/progress')
  getEventProgress(@Param('id') eventId: number): Promise<IEventProgress> {
    return this.eventsService.getEventProgress(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/not-evaluated')
  getNotEvaluatedEvaluators(@Param('id') eventId: number): Promise<INotEvaluated[]> {
    return this.eventsService.getNotEvaluatedEvaluators(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/user-rating')
  getUserRating(@Param('id') eventId: number): Promise<User[]> {
    return this.eventsService.getUserRating(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':eventId/evaluatee/:evaluateeId/criteria-rating')
  getUserCriteriaRating(
    @Param('eventId') eventId: number,
    @Param('evaluateeId') evaluateeId: number,
  ): Promise<User[]> {
    return this.eventsService.getUserCriteriaRating(eventId, evaluateeId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id/submissions/:submissionId')
  getSubmissionByEvaluatorId(
    @Param('id') eventId: number,
    @Param('submissionId') evaluatorId: number,
  ): Promise<ISubmission[]> {
    return this.eventsService.getSubmissionByEvaluatorId(eventId, evaluatorId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':eventId/submissions')
  getSubmissions(@Param('eventId') eventId: number): Promise<ISubmission[]> {
    return this.eventsService.getSubmissions(eventId)
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
  @Post(':id/invitation')
  async evaluationInvitation(
    @Param('id') eventId: number,
    @Body() invitation: {email: string},
  ): Promise<string> {
    const evaluator = await this.eventsService.findByEmail(invitation.email, eventId)
    const invitationToken = await this.jwtService.signAsync(
      {evaluatorId: evaluator.id, eventId: eventId},
      {secret: process.env.JWT_ACCESS_KEY, expiresIn: '1m'},
    )

    const link = `http://${process.env.HOST}:${process.env.PORT}/${process.env.SWAGGER_PATH}#/invitation/?code=${invitationToken}`
    await sendEvaluationEmail(invitation.email, link)
    return invitationToken
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
  async addEvaluators(@Param('id') eventId: number, @Body() userId: number): Promise<void> {
    await this.eventsService.addEvaluators(eventId, userId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id/evaluatee')
  async addEvaluatees(@Param('id') eventId: number, @Body() userId: number): Promise<void> {
    await this.eventsService.addEvaluatees(eventId, userId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put('evaluation')
  async evaluationResult(@Body() evaluationResult: IEvaluationResult): Promise<string> {
    try {
      const jwtPayload: JwtPayload | string = jwt.verify(
        evaluationResult.token,
        process.env.JWT_ACCESS_KEY,
      )
      if (typeof jwtPayload !== 'string') {
        await this.eventsService.setRating(
          jwtPayload.evaluatorId,
          jwtPayload.eventId,
          evaluationResult,
        )
      }
    } catch (error) {
      return error
    }
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
