import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, LessThan, MoreThan, Like, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { CreateEventDto } from '../dto/eventCreateDto';
import { UpdateEventDto } from '../dto/eventUpdateDto';
import { Event, EventDto } from '../entity/event';
import { UserSubCriteria } from '../entity/userSubCriteria';
import { User } from '../../users/entity/user';
import { Rating } from '../entity/rating';
import { EventEvaluator } from '../entity/eventEvaluator';
import { logger } from '../../logger';
import { EventEvaluatee } from '../entity/eventEvaluatee';
import { EventSubCriteriaUpdateDto } from '../dto/eventSubCriteriaUpdateDto';
import { isUpcomingEvent } from '../../utils/checkEventDate';
import { IEvaluationResult } from '../interface/evaluationResultInterface';
import { IUserSubCriteriaResult } from '../interface/userSubCriteriaResultInterface';
import { ISubmission } from '../interface/submissionInterface';
import { getSubmissions } from '../../utils/getSubmissions';
import { IEventProgress } from '../interface/eventProgress';
import { getNotEvaluatedEvaluators } from '../../utils/getNotEvaluatedEvaluators';
import { SubCriteriaRepository } from './subCriteriaRepository';
import { INotEvaluated } from '../interface/notEvaluatedEvaluators';
import { Criteria } from '../entity/criteria';
import { DtoLimitations } from '../../enums/dtoLimitations';
import { SubmissionState } from '../../enums/subMissionState';
import { Period } from '../../enums/eventPeriod';
import { UserRatingGetDto } from '../dto/userRatingGetDto';
import { UserPerformerTypeGetDto } from '../dto/userPerformerTypeGetDto';
import { ratingConverter } from '../../utils/ratingConverter';
import { PerformanceReportGetDto } from '../dto/performanceReportGetDto';
import { MyEventsGetDto } from '../dto/myEventsGetDto';
import { EventStatus } from '../../enums/eventStatus';

@Injectable()
export class EventsRepository {
  @InjectRepository(Event)
  eventRepository: Repository<Event>;

  @InjectRepository(User)
  userRepository: Repository<User>;

  @InjectRepository(Rating)
  ratingRepository: Repository<Rating>;

  @InjectRepository(Criteria)
  criteriaRepository: Repository<Criteria>;

  @Inject()
  subCriteriaRepository: SubCriteriaRepository;

  getOngoingEvents(): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder()
      .where({
        startsAt: LessThan(dayjs().toDate())
      })
      .andWhere({
        endsAt: MoreThan(dayjs().toDate())
      })
      .getMany();
  }

  async getSubmissionByEvaluatorId(
    eventId: number,
    evaluatorId: number
  ): Promise<ISubmission[]> {
    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['criteria', 'criteria.subCriteria']
    });

    let eventSubCriteriaCount = 0;
    currentEvent.criteria?.forEach((criteria) => {
      eventSubCriteriaCount += criteria.subCriteria.length;
    });

    const submissionSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId, evaluatorId })
      .select('COUNT(subCriteriaPoints) AS count')
      .groupBy('evaluateeId')
      .execute();

    const submissionModels = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId, evaluatorId })
      .select(
        'evaluatorId, evaluator.firstname AS evaluatorFirstName, evaluator.lastname AS evaluatorLastName, evaluator.position as evaluatorPosition'
      )
      .addSelect(
        'evaluateeId, evaluatee.firstname AS evaluateeFirstName, evaluatee.lastname AS evaluateeLastName, evaluatee.position as evaluateePosition'
      )
      .leftJoin(User, 'evaluator', 'evaluator.id = evaluatorId')
      .leftJoin(User, 'evaluatee', 'evaluatee.id = evaluateeId')
      .groupBy('evaluateeId ')
      .addGroupBy('evaluatorId')
      .execute();

    const eventTitle = (await getRepository(Event).findOne(eventId)).title;

    return getSubmissions(
      submissionModels,
      submissionSubCriteria,
      eventSubCriteriaCount,
      eventTitle
    );
  }

  async getSubmissions(eventId: number): Promise<ISubmission[]> {
    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['criteria', 'criteria.subCriteria']
    });

    let eventSubCriteriaCount = 0;
    currentEvent.criteria?.forEach((criteria) => {
      eventSubCriteriaCount += criteria.subCriteria.length;
    });

    const submissionSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select('COUNT(subCriteriaPoints) AS count')
      .groupBy('evaluateeId')
      .addGroupBy('evaluatorId')
      .execute();

    const submissionModels = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select(
        'evaluatorId, evaluator.firstname AS evaluatorFirstName, evaluator.lastname AS evaluatorLastName, evaluator.position as evaluatorPosition'
      )
      .addSelect(
        'evaluateeId, evaluatee.firstname AS evaluateeFirstName, evaluatee.lastname AS evaluateeLastName, evaluatee.position as evaluateePosition'
      )
      .leftJoin(User, 'evaluator', 'evaluator.id = evaluatorId')
      .leftJoin(User, 'evaluatee', 'evaluatee.id = evaluateeId')
      .groupBy('evaluatorId')
      .addGroupBy('evaluateeId')
      .execute();

    const eventTitle = (await getRepository(Event).findOne(eventId)).title;

    return getSubmissions(
      submissionModels,
      submissionSubCriteria,
      eventSubCriteriaCount,
      eventTitle
    );
  }

  async getPerformanceReport(
    eventId: number
  ): Promise<PerformanceReportGetDto[]> {
    const criteriaRatings = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select([
        'event.title, event.startsAt, criteria.name, SUM(subCriteriaPoints) as rating, evaluatee.performerType, criteriaId'
      ])
      .addSelect(
        'evaluatee.firstname AS evaluateeFirstName, evaluatee.lastname AS evaluateeLastName, evaluatee.position as evaluateePosition'
      )
      .addSelect(
        'evaluator.firstname AS evaluatorFirstName, evaluator.lastname AS evaluatorLastName, evaluator.position as evaluatorPosition'
      )
      .leftJoin(User, 'evaluator', 'evaluator.id = evaluatorId')
      .leftJoin(User, 'evaluatee', 'evaluatee.id = evaluateeId')
      .leftJoin(Criteria, 'criteria', 'criteria.id = criteriaId')
      .leftJoin(Event, 'event', 'event.id = eventId')
      .groupBy('criteriaId')
      .addGroupBy('evaluatorId')
      .addGroupBy('evaluateeId')
      .execute();

    const criteriaMaxPoints = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select('criteriaId, COUNT(subCriteriaPoints) as rating')
      .leftJoin(User, 'user', 'user.id = evaluateeId')
      .groupBy('criteriaId')
      .execute();

    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['rating']
    });
    let rankingScale = 10;
    currentEvent.rating?.forEach((rating) =>
      rating.isSelected ? (rankingScale = rating.to) : rankingScale
    );
    return criteriaRatings.map((criteriaRating) => {
      return {
        ...criteriaRating,
        rating: (
          (criteriaRating?.rating /
            (criteriaMaxPoints.find(
              (object) => object.criteriaId === criteriaRating.criteriaId
            ).rating *
              DtoLimitations.subCriteriaPointMax)) *
          rankingScale
        ).toFixed(1)
      };
    });
  }

  async getAllEventsProgress(): Promise<IEventProgress[]> {
    const events = await this.findAll();
    let eventsProgress = [];
    for (const event of events) {
      const index = events.indexOf(event);
      eventsProgress[index] = await this.getEventProgress(event.id);
    }
    return eventsProgress;
  }

  async getEventProgress(eventId: number): Promise<IEventProgress> {
    const submissions = await this.getSubmissions(eventId);

    let completedSubmissionCount = 0;
    submissions.forEach((submission) =>
      submission.submissionState === SubmissionState.completed
        ? completedSubmissionCount++
        : completedSubmissionCount
    );
    const currentEvent = await this.eventRepository.findOne(eventId);
    return {
      progressPercentage: Number(
        ((completedSubmissionCount / submissions.length) * 100).toFixed(1)
      ),
      title: currentEvent.title,
      startDate: currentEvent.startsAt,
      endDate: currentEvent.endsAt
    };
  }

  async getNotEvaluatedEvaluators(eventId: number): Promise<INotEvaluated[]> {
    const evaluationPairs = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select('evaluatorId, evaluateeId, eventId')
      .groupBy('evaluatorId, evaluateeId')
      .select(
        'evaluatorId, evaluateeId, user.firstName, user.lastName, MAX(event.endsAt) as lastEvent'
      )
      .leftJoin(User, 'user', 'user.id = evaluatorId')
      .leftJoin(
        EventEvaluator,
        'eventEvaluator',
        'eventEvaluator.userId = evaluatorId'
      )
      .leftJoin(
        Event,
        'event',
        'event.endsAt < NOW() AND event.id = eventEvaluator.eventId'
      )
      .execute();

    return getNotEvaluatedEvaluators(evaluationPairs);
  }

  async getUserRating(eventId: number): Promise<UserRatingGetDto[]> {
    const usersRating = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select(['evaluateeId, eventId'])
      .addSelect(['SUM(subCriteriaPoints) AS rating'])
      .groupBy('evaluateeId')
      .getRawMany();

    const userSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select(['evaluateeId, eventId'])
      .addSelect(['COUNT(subCriteriaPoints) AS rating'])
      .groupBy('evaluateeId')
      .getRawMany();

    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['rating']
    });
    let rankingScale = 10;
    currentEvent.rating?.forEach((rating) =>
      rating.isSelected ? (rankingScale = rating.to) : rankingScale
    );

    function setRating(user: UserSubCriteria): number {
      for (let i = 0; i < usersRating.length; i++) {
        if (user.evaluateeId === usersRating[i].evaluateeId) {
          return Number(
            (
              (usersRating[i].rating /
                (userSubCriteria[i]?.rating *
                  DtoLimitations.subCriteriaPointMax)) *
              rankingScale
            ).toFixed(1)
          );
        }
      }
    }

    const evaluatees = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .select('evaluateeId,user.rating')
      .leftJoin(User, 'user', 'evaluateeId = user.id')
      .andWhere('evaluateeId  = user.id')
      .groupBy('evaluateeId')
      .execute();

    evaluatees.forEach((user) => {
      user.rating = setRating(user) ?? 0;
    });

    return evaluatees.sort(
      (firstEvaluatee, secondEvaluatee) =>
        secondEvaluatee.rating - firstEvaluatee.rating
    );
  }

  async getUserPerformerType(
    eventId: number
  ): Promise<UserPerformerTypeGetDto[]> {
    const userRating = await this.getUserRating(eventId);

    return userRating.map((userRating) => {
      return {
        evaluateeId: userRating.evaluateeId,
        performerType: ratingConverter(userRating.rating)
      };
    });
  }

  async getUserCriteriaRating(eventId: number, evaluateeId: number) {
    const criteriaRatings = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .andWhere({ evaluateeId })
      .select('user.firstName, user.lastName, user.position, criteriaId')
      .addSelect(['evaluateeId, eventId,SUM(subCriteriaPoints) as rating'])
      .leftJoin(User, 'user', 'user.id = evaluateeId')
      .groupBy('criteriaId')
      .execute();

    const subCriteriaCount = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({ eventId })
      .andWhere({ evaluateeId })
      .select('criteriaId, COUNT(subCriteriaPoints) * 10 as rating')
      .leftJoin(User, 'user', 'user.id = evaluateeId')
      .groupBy('criteriaId')
      .execute();

    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['rating']
    });
    let rankingScale = 10;
    currentEvent.rating?.forEach((rating) =>
      rating.isSelected ? (rankingScale = rating.to) : rankingScale
    );

    return criteriaRatings.map((criteriaRating, index) => {
      return {
        ...criteriaRating,
        rating: (
          (criteriaRating?.rating / subCriteriaCount[index]?.rating) *
          rankingScale
        ).toFixed(1)
      };
    });
  }

  async addEvaluators(eventId: number, userId: number[]): Promise<void> {
    if (!isUpcomingEvent(await this.eventRepository.findOne(eventId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event'
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const eventEvaluatorRepository = await getRepository(EventEvaluator);
    for (let i = 0; i < userId.length; i++) {
      if (
        await eventEvaluatorRepository
          .createQueryBuilder()
          .where({ eventId })
          .getOne()
      ) {
        if (
          await eventEvaluatorRepository
            .createQueryBuilder()
            .where({ eventId })
            .andWhere({ userId: userId[i] })
            .getOne()
        ) {
          logger.info('data already exists');
        } else {
          await eventEvaluatorRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId: userId[i],
              eventId
            })
            .execute();
        }
      } else {
        logger.error("couldn't find event");
      }
    }
  }

  async addEvaluatees(eventId: number, userId: number[]) {
    if (!isUpcomingEvent(await this.eventRepository.findOne(eventId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event'
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const eventEvaluateeRepository = await getRepository(EventEvaluatee);

    for (let i = 0; i < userId.length; i++) {
      if (
        await eventEvaluateeRepository
          .createQueryBuilder()
          .where({ eventId })
          .getOne()
      ) {
        if (
          await eventEvaluateeRepository
            .createQueryBuilder()
            .where({ eventId })
            .andWhere({ userId: userId[i] })
            .getOne()
        ) {
          logger.info('data already exists');
        } else {
          await eventEvaluateeRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId: userId[i],
              eventId
            })
            .execute();
        }
      } else {
        logger.error("couldn't find event");
      }
    }
  }

  addElement(event: Event) {
    return this.eventRepository.save(event);
  }

  removeElement(event: Event) {
    return this.eventRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async getMyEvents(): Promise<MyEventsGetDto[]> {
    const events = await this.findAll();
    let status: EventStatus;
    return events.map((event) => {
      if (isUpcomingEvent(events[0])) status = EventStatus.upcoming;
      else if (
        events[0].endsAt > dayjs().toDate() &&
        events[0].startsAt < dayjs().toDate()
      )
        status = EventStatus.ongoing;
      else status = EventStatus.expired;
      return {
        status: status,
        title: event.title,
        startsAt: event.startsAt
      };
    });
  }

  findOneById(id: number): Promise<Event> {
    return this.eventRepository.findOne(id);
  }

  findOneWithRatingRelationById(id: number): Promise<Event> {
    return this.eventRepository.findOne(id, { relations: ['rating'] });
  }

  findOneWithCriteriaRelationById(id: number): Promise<Event> {
    return this.eventRepository.findOne(id, { relations: ['criteria'] });
  }

  findByTitle(title: string): Promise<Event[]> {
    return this.eventRepository.find({ title: Like(`%${title}%`) });
  }

  findAllByBonus(bonus: number): Promise<Event[]> {
    return this.eventRepository.find({ where: { bonus: Like(`%${bonus}%`) } });
  }

  findAllByTimePeriod(timePeriod: Period): Promise<Event[]> {
    return this.eventRepository.find({
      where: { timePeriod: Like(`%${timePeriod}%`) }
    });
  }

  findAllByDate(date: Date): Promise<Event[]> {
    return this.eventRepository.find({ where: { endsAt: Like(`%${date}%`) } });
  }

  findOneByTitle(title: string): Promise<Event> {
    return this.eventRepository.findOne({ title: Like(`%${title}%`) });
  }

  async findEvaluator(evaluatorName: string): Promise<Event[]> {
    const evaluator = await this.userRepository.findOne({
      where: { firstName: evaluatorName }
    });
    const events = await getRepository(Event)
      .createQueryBuilder('event')
      .where('evaluator.userId = :value', { value: evaluator.id })
      .select('evaluator.userId, event.id')
      .leftJoin(EventEvaluator, 'evaluator', 'evaluator.eventId = event.id')
      .execute();
    const trueEvents = [];
    events.map((event) =>
      trueEvents.push(this.eventRepository.findOne(event.id))
    );

    return Promise.all(trueEvents);
  }

  findOneByDate(date: Date): Promise<Event> {
    return this.eventRepository.findOne({
      where: { endsAt: Like(`%${date}%`) }
    });
  }

  async findByEmail(email: string, eventId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    try {
      await getRepository(EventEvaluator).findOne({
        where: { userId: user.id, eventId }
      });
      return user;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `There is no such an evaluator in current event`
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async create(createEventDto: CreateEventDto): Promise<EventDto> {
    const event = await this.eventRepository.save(createEventDto);
    await getRepository(EventEvaluatee)
      .createQueryBuilder()
      .insert()
      .values({
        eventId: event.id,
        userId: 0
      })
      .execute();
    await getRepository(EventEvaluator)
      .createQueryBuilder()
      .insert()
      .values({
        eventId: event.id,
        userId: 0
      })
      .execute();
    await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .insert()
      .into(UserSubCriteria)
      .values({
        eventId: event.id,
        criteriaId: 0,
        evaluateeId: 0,
        evaluatorId: 0,
        subCriteriaId: 0,
        subCriteriaPoints: 0,
        userId: 0,
        ratingId: 0
      })
      .execute();
    createEventDto.rating = await this.ratingRepository.find({ take: 3 });
    return event;
  }

  async update(
    eventId: number,
    updateEventDto: UpdateEventDto
  ): Promise<Event> {
    const event = await this.eventRepository.preload({
      id: eventId,
      ...updateEventDto
    });

    return this.eventRepository.save(event);
  }

  async setRating(
    evaluatorId: number,
    eventId: number,
    evaluationResult: IEvaluationResult
  ): Promise<void> {
    if (evaluatorId === evaluationResult.evaluateeId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User trying to evaluate himself'
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      (await getRepository(EventEvaluatee).findOne({
        where: { userId: evaluationResult.evaluateeId, eventId }
      })) === undefined
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'There is no such an evaluatee in current event'
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const userSubCriteriaResults: IUserSubCriteriaResult[] = [];
    let isSubCriteria: boolean;

    for (const [key, value] of Object.entries(evaluationResult.results)) {
      isSubCriteria = false;
      (
        await this.eventRepository.findOne(eventId, {
          relations: ['criteria', 'criteria.subCriteria']
        })
      ).criteria?.forEach((criteria) => {
        criteria.subCriteria?.forEach((subcriteria) => {
          if (subcriteria.id === Number(key)) {
            isSubCriteria = true;
          }
        });
      });

      if (isSubCriteria) {
        const userSubCriteria = new UserSubCriteria();
        userSubCriteria.subCriteriaId = Number(key);
        userSubCriteria.eventId = eventId;
        userSubCriteria.evaluateeId = evaluationResult.evaluateeId;
        userSubCriteria.evaluatorId = evaluatorId;
        userSubCriteria.criteriaId = (
          await this.subCriteriaRepository.findOneById(Number(key))
        ).criteria.id;
        userSubCriteria.subCriteriaPoints = value;
        if (
          !(await getRepository(UserSubCriteria).findOne({
            eventId,
            evaluatorId,
            evaluateeId: evaluationResult.evaluateeId
          }))
        ) {
          userSubCriteriaResults.push(userSubCriteria);
        } else {
          await getRepository(UserSubCriteria)
            .createQueryBuilder()
            .delete()
            .from(UserSubCriteria)
            .where({
              eventId,
              evaluatorId,
              evaluateeId: evaluationResult.evaluateeId
            })
            .execute();
          userSubCriteriaResults.push(userSubCriteria);
        }
      }
    }

    await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .insert()
      .into(UserSubCriteria)
      .values(userSubCriteriaResults)
      .updateEntity(false)
      .execute();
  }

  async remove(id: number): Promise<Event> {
    return this.eventRepository.remove(await this.findOneById(id));
  }
}
