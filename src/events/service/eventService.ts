import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { CreateEventDto } from '../dto/eventCreateDto';
import { UpdateEventDto } from '../dto/eventUpdateDto';
import { Event, EventDto } from '../entity/event';
import { EventsRepository } from '../repository/eventRepository';
import { logger } from '../../logger';
import { User } from '../../users/entity/user';
import { RatingRepository } from '../repository/ratingRepository';
import { CriteriaRepository } from '../repository/criteriaRepository';
import { UserRepository } from '../../users/repository/userRepository';
import { IEventSearch } from '../interface/eventSearchInterface';
import { EventSubCriteriaUpdateDto } from '../dto/eventSubCriteriaUpdateDto';
import { isUpcomingEvent } from '../../utils/checkEventDate';
import { IEvaluationResult } from '../interface/evaluationResultInterface';
import { ISubmission } from '../interface/submissionInterface';
import { IEventProgress } from '../interface/eventProgress';
import { INotEvaluated } from '../interface/notEvaluatedEvaluators';
import { UserCriteriaRatingGetDto } from '../dto/userCriteriaRatingGetDto';
import { UserRatingGetDto } from '../dto/userRatingGetDto';
import { UserPerformerTypeGetDto } from '../dto/userPerformerTypeGetDto';
import { PerformanceReportGetDto } from '../dto/performanceReportGetDto';

@Injectable()
export class EventsService {
  @Inject()
  eventsRepository: EventsRepository;

  @Inject()
  ratingRepository: RatingRepository;

  @Inject()
  criteriaRepository: CriteriaRepository;

  @Inject()
  userRepository: UserRepository;

  getOngoingEvents(): Promise<Event[]> {
    return this.eventsRepository.getOngoingEvents();
  }

  getAllEventsProgress(): Promise<IEventProgress[]> {
    return this.eventsRepository.getAllEventsProgress();
  }

  getEventProgress(eventId: number): Promise<IEventProgress> {
    return this.eventsRepository.getEventProgress(eventId);
  }

  getNotEvaluatedEvaluators(eventId: number): Promise<INotEvaluated[]> {
    return this.eventsRepository.getNotEvaluatedEvaluators(eventId);
  }

  getUserRating(eventId: number): Promise<UserRatingGetDto[]> {
    return this.eventsRepository.getUserRating(eventId);
  }

  getUserPerformerType(eventId: number): Promise<UserPerformerTypeGetDto[]> {
    return this.eventsRepository.getUserPerformerType(eventId);
  }

  getUserCriteriaRating(
    eventId: number,
    evaluateeId: number
  ): Promise<UserCriteriaRatingGetDto[]> {
    return this.eventsRepository.getUserCriteriaRating(eventId, evaluateeId);
  }

  getSubmissionByEvaluatorId(
    eventId: number,
    evaluatorId: number
  ): Promise<ISubmission[]> {
    return this.eventsRepository.getSubmissionByEvaluatorId(
      eventId,
      evaluatorId
    );
  }

  getSubmissions(eventId: number): Promise<ISubmission[]> {
    return this.eventsRepository.getSubmissions(eventId);
  }

  getPerformanceReport(eventId: number): Promise<PerformanceReportGetDto[]> {
    return this.eventsRepository.getPerformanceReport(eventId);
  }

  async addRating(eventId: number, ratingId: number): Promise<Event> {
    const rating = await this.ratingRepository.findOneById(ratingId);
    const event = await this.eventsRepository.findOneWithRatingRelationById(
      eventId
    );
    if (!isUpcomingEvent(event))
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event'
        },
        HttpStatus.BAD_REQUEST
      );
    !event.rating ? (event.rating = [rating]) : event.rating.push(rating);

    return this.eventsRepository.addElement(event);
  }

  async addCriteria(eventId: number, criteriaId: number): Promise<Event> {
    const criteria = await this.criteriaRepository.findOneById(criteriaId);
    const event = await this.eventsRepository.findOneWithCriteriaRelationById(
      eventId
    );
    if (!isUpcomingEvent(event))
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event'
        },
        HttpStatus.BAD_REQUEST
      );
    !event.criteria
      ? (event.criteria = [criteria])
      : event.criteria.push(criteria);

    return this.eventsRepository.addElement(event);
  }

  async removeCriteria(eventId: number, criteriaId: number): Promise<Event> {
    const event = await this.eventsRepository.findOneWithCriteriaRelationById(
      eventId
    );

    const criteriaIndex = event.criteria.findIndex((criteria) => {
      return criteria.id === criteriaId;
    });
    event.criteria.splice(criteriaIndex, 1);
    return this.eventsRepository.removeElement(event);
  }

  async addSubCriteria(Id: number, idRef: number[]): Promise<void> {
    await this.criteriaRepository.addSubCriteria(Id, idRef);
  }

  addEvaluators(eventId: number, userId: number[]): Promise<void> {
    return this.eventsRepository.addEvaluators(eventId, userId);
  }

  addEvaluatees(eventId: number, userId: number[]): Promise<void> {
    return this.eventsRepository.addEvaluatees(eventId, userId);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.findAll();
  }
  async getMyEvents() {
    return this.eventsRepository.getMyEvents();
  }

  async search(params: IEventSearch): Promise<Event[]> {
    if (params.title) return this.eventsRepository.findByTitle(params.title);
    if (params.bonus) return this.eventsRepository.findAllByBonus(params.bonus);
    if (params.period)
      return this.eventsRepository.findAllByTimePeriod(params.period);
    if (params.date) return this.eventsRepository.findAllByDate(params.date);
    if (params.completedEventTitle)
      return [
        await this.eventsRepository.findOneByTitle(params.completedEventTitle)
      ];
    if (params.completedEventDate)
      return [
        await this.eventsRepository.findOneByDate(params.completedEventDate)
      ];
    if (params.evaluatorName)
      return await this.eventsRepository.findEvaluator(params.evaluatorName);
  }

  findOneById(id: number): Promise<Event> {
    return this.eventsRepository.findOneById(id);
  }

  findByEmail(email: string, eventId: number): Promise<User> {
    return this.eventsRepository.findByEmail(email, eventId);
  }

  setRating(
    evaluatorId: number,
    eventId: number,
    evaluationResult: IEvaluationResult
  ): Promise<void> {
    return this.eventsRepository.setRating(
      evaluatorId,
      eventId,
      evaluationResult
    );
  }

  create(createEventDto: CreateEventDto): Promise<EventDto> {
    try {
      createEventDto.startsAt = dayjs()
        .add(Number(createEventDto.startsAt), 'day')
        .toDate();
      createEventDto.endsAt = dayjs(createEventDto.startsAt)
        .add(Number(createEventDto.endsAt), 'day')
        .toDate();
    } catch (error) {
      logger.error(`end date doesn't created ${error.message}`);
    }
    return this.eventsRepository.create(createEventDto);
  }

  update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventsRepository.update(id, updateEventDto);
  }

  remove(id: number): Promise<Event> {
    return this.eventsRepository.remove(id);
  }
}
