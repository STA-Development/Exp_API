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
  Query
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { EventsService } from '../service/eventService';
import { CreateEventDto } from '../dto/eventCreateDto';
import { UpdateEventDto } from '../dto/eventUpdateDto';
import { Event, EventDto, EventTitleAndIdDto } from '../entity/event';
import { eventGetDto } from '../dto/eventGetDto';
import { IEventSearch } from '../interface/eventSearchInterface';
import { EventSubCriteriaUpdateDto } from '../dto/eventSubCriteriaUpdateDto';
import { IEventProgress } from '../interface/eventProgress';
import { INotEvaluated } from '../interface/notEvaluatedEvaluators';
import { EventProgressGetDto } from '../dto/eventProgressGetDto';
import { NotEvaluatedDto } from '../dto/notEvaluatedDto';
import { UserRatingGetDto } from '../dto/userRatingGetDto';
import { UserCriteriaRatingGetDto } from '../dto/userCriteriaRatingGetDto';
import { SubmissionGetDto } from '../dto/submissionGetDto';
import { InvitationDto } from '../dto/invitationDto';
import {
  EjsFormSubjects,
  sendEvaluationEmail
} from '../../utils/sendEvaluationMail';
import { EvaluationResultRequestDto } from '../dto/evaluationResultRequestDto';
import { ElementDto } from '../dto/elementDto';
import { PerformanceReportGetDto } from '../dto/performanceReportGetDto';
import { UserPerformerTypeGetDto } from '../dto/userPerformerTypeGetDto';
import { eventTitleAndIdGetDto } from '../dto/eventTitleAndIdGetDto';
import { EventSearchDto } from '../dto/eventSearchDto';
import { MyEventsGetDto } from '../dto/myEventsGetDto';

@ApiTags('event')
@Controller('events')
export class EventsController {
  @Inject()
  eventsService: EventsService;

  @Inject()
  jwtService: JwtService;

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventDto] })
  @Get()
  async findAll(): Promise<EventDto[]> {
    return (await this.eventsService.findAll()).map((event) =>
      eventGetDto(event)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventTitleAndIdDto] })
  @Get('title-and-Id')
  async getEventNameAndId(): Promise<EventTitleAndIdDto[]> {
    return (await this.eventsService.findAll()).map(
      (event) => eventTitleAndIdGetDto(event) //todo do this wrap in controller or in service?
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [MyEventsGetDto] })
  @Get('my-events')
  async getMyEvents() {
    return this.eventsService.getMyEvents();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventDto] })
  @Get('search')
  async search(@Query() eventSearchDto: EventSearchDto): Promise<EventDto[]> {
    const params: IEventSearch = { ...eventSearchDto };

    return (await this.eventsService.search(params)).map((event) =>
      eventGetDto(event)
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventDto] })
  @Get('ongoing')
  getOngoingEvents(): Promise<Event[]> {
    return this.eventsService.getOngoingEvents();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventProgressGetDto] })
  @Get('progress')
  getAllEventsProgress(): Promise<IEventProgress[]> {
    return this.eventsService.getAllEventsProgress();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventProgressGetDto] })
  @Get(':id/progress')
  getEventProgress(@Param('id') eventId: number): Promise<IEventProgress> {
    return this.eventsService.getEventProgress(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [NotEvaluatedDto] })
  @Get(':id/not-evaluated')
  getNotEvaluatedEvaluators(
    @Param('id') eventId: number
  ): Promise<INotEvaluated[]> {
    return this.eventsService.getNotEvaluatedEvaluators(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [UserRatingGetDto] })
  @Get(':id/user-rating')
  getUserRating(@Param('id') eventId: number): Promise<UserRatingGetDto[]> {
    return this.eventsService.getUserRating(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [UserPerformerTypeGetDto] })
  @Get(':id/user/performer-type')
  getUserPerformerType(
    @Param('id') eventId: number
  ): Promise<UserPerformerTypeGetDto[]> {
    return this.eventsService.getUserPerformerType(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [UserCriteriaRatingGetDto] })
  @Get(':eventId/evaluatee/:evaluateeId/criteria-rating')
  getUserCriteriaRating(
    @Param('eventId') eventId: number,
    @Param('evaluateeId') evaluateeId: number
  ): Promise<UserCriteriaRatingGetDto[]> {
    return this.eventsService.getUserCriteriaRating(eventId, evaluateeId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [SubmissionGetDto] })
  @Get(':id/submissions/:evaluatorId')
  getSubmissionByEvaluatorId(
    @Param('id') eventId: number,
    @Param('evaluatorId') evaluatorId: number
  ): Promise<SubmissionGetDto[]> {
    return this.eventsService.getSubmissionByEvaluatorId(eventId, evaluatorId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [SubmissionGetDto] })
  @Get(':eventId/submissions')
  getSubmissions(
    @Param('eventId') eventId: number
  ): Promise<SubmissionGetDto[]> {
    return this.eventsService.getSubmissions(eventId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [PerformanceReportGetDto] })
  @Get('performance-report')
  async getPerformanceReport(
    @Query() eventSearchDto: EventSearchDto
  ): Promise<PerformanceReportGetDto[]> {
    const params: IEventSearch = { ...eventSearchDto };
    const currentEvent = (await this.eventsService.search(params)).map(
      (event) => eventGetDto(event)
    );

    return this.eventsService.getPerformanceReportByEvaluateeId(
      currentEvent[0].id
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: [EventDto] })
  @Get(':id')
  async findOneById(@Param('id') id: number): Promise<EventDto> {
    return eventGetDto(await this.eventsService.findOneById(id));
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<EventDto> {
    return this.eventsService.create(createEventDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':eventId/invitation')
  async evaluationInvitation(
    @Param('eventId') eventId: number,
    @Body() invitation: InvitationDto
  ): Promise<string> {
    const evaluator = await this.eventsService.findByEmail(
      invitation.email,
      eventId
    );
    const invitationToken = await this.jwtService.signAsync(
      { evaluatorId: evaluator.id, eventId },
      {
        secret: process.env.JWT_ACCESS_KEY,
        expiresIn: process.env.JWT_INVITATION_KEY_EXPIRES_IN
      }
    );
    const { startEvaluation } = EjsFormSubjects;
    const link = `http://${process.env.HOST}:${process.env.PORT}/${process.env.SWAGGER_PATH}#/invitation/?code=${invitationToken}`;
    await sendEvaluationEmail(invitation.email, link, startEvaluation);
    return invitationToken;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':eventId/rating')
  addRating(
    @Param('eventId') eventId: number,
    @Body() ratingRef: ElementDto
  ): Promise<Event> {
    return this.eventsService.addRating(eventId, ratingRef.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':eventId/criteria')
  addCriteria(
    @Param('eventId') eventId: number,
    @Body() criteriaRef: ElementDto
  ): Promise<Event> {
    return this.eventsService.addCriteria(eventId, criteriaRef.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':eventId/criteria')
  removeCriteria(
    @Param('eventId') eventId: number,
    @Body() criteriaRef: ElementDto
  ): Promise<Event> {
    return this.eventsService.removeCriteria(eventId, criteriaRef.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':eventId/subCriteria')
  addSubCriteria(
    @Param('eventId') eventId: number,
    @Body() criteriaRef: EventSubCriteriaUpdateDto
  ): Promise<void> {
    return this.eventsService.addSubCriteria(eventId, criteriaRef);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':eventId/evaluator')
  async addEvaluators(
    @Param('eventId') eventId: number,
    @Body() userRef: ElementDto
  ): Promise<void> {
    await this.eventsService.addEvaluators(eventId, userRef.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':eventId/evaluatee')
  async addEvaluatees(
    @Param('eventId') eventId: number,
    @Body() userRef: ElementDto
  ): Promise<void> {
    await this.eventsService.addEvaluatees(eventId, userRef.id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put('evaluation')
  async evaluationResult(
    @Body() evaluationResult: EvaluationResultRequestDto
  ): Promise<void> {
    try {
      const jwtPayload: JwtPayload | string = jwt.verify(
        evaluationResult.token,
        process.env.JWT_ACCESS_KEY
      );

      if (typeof jwtPayload !== 'string') {
        await this.eventsService.setRating(
          jwtPayload.evaluatorId,
          jwtPayload.eventId,
          evaluationResult
        );
      }
    } catch (error) {
      throw error;
    }
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
