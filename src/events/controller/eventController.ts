import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Patch,
  Inject,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
} from '@nestjs/common'
import {ApiOkResponse} from '@nestjs/swagger'
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
import {EventSubCriteriaUpdateDto} from '../dto/eventSubCriteriaUpdateDto'
import {sendEmail} from '../../utils/sendEmail'
import {IEvaluationResult} from '../interface/evaluationResultInterface'
import {ISubmission} from '../interface/submissionInterface'
import {IEventProgress} from '../interface/eventProgress'
import {INotEvaluated} from '../interface/notEvaluatedEvaluators'
import {EventProgressGetDto} from '../dto/eventProgressGetDto'
import {NotEvaluatedDto} from '../dto/notEvaluatedDto'
import {UserRatingGetDto} from '../dto/userRatingGetDto'
import {UserCriteriaRatingGetDto} from '../dto/userCriteriaRatingGetDto'
import {SubmissionGetDto} from '../dto/submissionGetDto'
import {InvitationDto} from '../dto/invitationDto'
import {sendEvaluationEmail} from '../../utils/sendEvaluationMail'

@Controller('events')
export class EventsController {
  @Inject()
  eventsService: EventsService

  @Inject()
  jwtService: JwtService

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [EventDto]})
  @Get()
  async findAll(): Promise<EventDto[]> {
    return (await this.eventsService.findAll()).map((event) => eventGetDto(event))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [EventDto]})
  @Get('search')
  async search(@Req() req: Request): Promise<EventDto[]> {
    const params: IEventSearch = {...req.query}
    return (await this.eventsService.search(params)).map((event) => eventGetDto(event))
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [EventDto]})
  @Get('ongoing')
  getOngoingEvents(): Promise<Event[]> {
    return this.eventsService.getOngoingEvents()
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [EventProgressGetDto]})
  @Get(':id/progress')
  getEventProgress(@Param('id') eventId: number): Promise<IEventProgress> {
    return this.eventsService.getEventProgress(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [NotEvaluatedDto]})
  @Get(':id/not-evaluated')
  getNotEvaluatedEvaluators(@Param('id') eventId: number): Promise<INotEvaluated[]> {
    return this.eventsService.getNotEvaluatedEvaluators(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [UserRatingGetDto]})
  @Get(':id/user-rating')
  getUserRating(@Param('id') eventId: number): Promise<User[]> {
    return this.eventsService.getUserRating(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [UserCriteriaRatingGetDto]})
  @Get(':eventId/evaluatee/:evaluateeId/criteria-rating')
  getUserCriteriaRating(
    @Param('eventId') eventId: number,
    @Param('evaluateeId') evaluateeId: number,
  ): Promise<User[]> {
    return this.eventsService.getUserCriteriaRating(eventId, evaluateeId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [SubmissionGetDto]})
  @Get(':id/submissions/:submissionId')
  getSubmissionByEvaluatorId(
    @Param('id') eventId: number,
    @Param('submissionId') evaluatorId: number,
  ): Promise<ISubmission[]> {
    return this.eventsService.getSubmissionByEvaluatorId(eventId, evaluatorId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [SubmissionGetDto]})
  @Get(':eventId/submissions')
  getSubmissions(@Param('eventId') eventId: number): Promise<ISubmission[]> {
    return this.eventsService.getSubmissions(eventId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({type: [EventDto]})
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
    @Body() invitation: InvitationDto,
  ): Promise<string> {
    const evaluator = await this.eventsService.findByEmail(invitation.email, eventId)
    const invitationToken = await this.jwtService.signAsync(
      {evaluatorId: evaluator.id, eventId},
      {secret: process.env.JWT_ACCESS_KEY, expiresIn: '1m'},
    )

    const link = `http://${process.env.HOST}:${process.env.PORT}/${process.env.SWAGGER_PATH}#/invitation/?code=${invitationToken}`
    await sendEvaluationEmail(invitation.email, link)
    return invitationToken
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/rating')
  addRating(@Param('id') eventId: number, @Body() ratingId: number): Promise<Event> {
    return this.eventsService.addRating(eventId, ratingId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/criteria')
  addCriteria(@Param('id') eventId: number, @Body() criteriaId: number): Promise<Event> {
    return this.eventsService.addCriteria(eventId, criteriaId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/subCriteria')
  addSubCriteria(
    @Param('id') eventId: number,
    @Body() criteriaRef: EventSubCriteriaUpdateDto,
  ): Promise<void> {
    return this.eventsService.addSubCriteria(eventId, criteriaRef)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/evaluator')
  async addEvaluators(@Param('id') eventId: number, @Body() userId: number): Promise<void> {
    await this.eventsService.addEvaluators(eventId, userId)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id/evaluatee')
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
