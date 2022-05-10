import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {getRepository, LessThan, MoreThan, Like, Repository} from 'typeorm'
import * as dayjs from 'dayjs'
import {CreateEventDto} from '../dto/eventCreateDto'
import {UpdateEventDto} from '../dto/eventUpdateDto'
import {Event, EventDto} from '../entity/event'
import {Period} from '../interface/eventInterface'
import {UserSubCriteria} from '../entity/userSubCriteria'
import {User} from '../../users/entity/user'
import {Rating} from '../entity/rating'
import {EventEvaluator} from '../entity/eventEvaluator'
import {logger} from '../../logger'
import {EventEvaluatee} from '../entity/eventEvaluatee'
import {EventSubCriteriaUpdateDto} from '../dto/eventSubCriteriaUpdateDto'
import {isUpcomingEvent} from '../../utils/checkEventDate'
import {IEvaluationResult} from '../interface/evaluationResultInterface'
import {IUserSubCriteriaResult} from '../interface/userSubCriteriaResultInterface'
import {ISubmission, SubmissionState} from '../interface/submissionInterface'
import {getSubmissions} from '../../utils/getSubmissions'
import {IEventProgress} from '../interface/eventProgress'
import {getNotEvaluatedEvaluators} from '../../utils/getNotEvaluatedEvaluators'
import {SubCriteriaRepository} from './subCriteriaRepository'
import {INotEvaluated} from '../interface/notEvaluatedEvaluators'

@Injectable()
export class EventsRepository {
  @InjectRepository(Event)
  eventRepository: Repository<Event>

  @InjectRepository(User)
  userRepository: Repository<User>

  @InjectRepository(Rating)
  ratingRepository: Repository<Rating>

  @Inject()
  subCriteriaRepository: SubCriteriaRepository

  getOngoingEvents(): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder()
      .where({
        createdAt: LessThan(dayjs().toDate()),
      })
      .andWhere({
        endsAt: MoreThan(dayjs().toDate()),
      })
      .getMany()
  }

  async addSubCriteria(eventId: number, idRef: EventSubCriteriaUpdateDto) {
    const userSubCriteriaRepository = await getRepository(UserSubCriteria)
    const userSubCriteria = await userSubCriteriaRepository.findOne({
      order: {id: 'DESC'},
      where: {eventId},
    })

    const {ratingId} = userSubCriteria || {
      ratingId: 0,
    }

    const userSubCriterias = []
    for (let i = 0; i < idRef.subCriteriaId.length; i++) {
      const userSubCriteria = new UserSubCriteria()
      userSubCriteria.subCriteriaId = idRef.subCriteriaId[i]
      userSubCriteria.eventId = eventId
      userSubCriteria.criteriaId = (
        await this.subCriteriaRepository.findOneById(idRef.subCriteriaId[i])
      ).criteria.id
      userSubCriteria.ratingId = ratingId
      userSubCriteria.userId = idRef.userId
      !(await userSubCriteriaRepository.findOne(userSubCriteria))
        ? userSubCriterias.push(userSubCriteria)
        : logger.info('data already exists')
    }

    if (await userSubCriteriaRepository.createQueryBuilder().where({eventId}).getOne())
      await userSubCriteriaRepository
        .createQueryBuilder()
        .insert()
        .values(userSubCriterias)
        .execute()
    else
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
  }

  async getSubmissionByEvaluatorId(eventId: number, evaluatorId: number): Promise<ISubmission[]> {
    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['criteria', 'criteria.subCriteria'],
    })

    let eventSubCriteriaCount = 0
    currentEvent.criteria?.forEach((criteria) => {
      eventSubCriteriaCount += criteria.subCriteria.length
    })

    const submissionSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId, evaluatorId})
      .select('COUNT(subCriteriaResult) AS count')
      .groupBy('evaluateeId')
      .execute()

    const submissionModels = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId, evaluatorId})
      .select(
        'evaluatorId, evaluator.firstname AS evaluatorFirstName, evaluator.lastname AS evaluatorLastName, evaluator.position as evaluatorPosition',
      )
      .addSelect(
        'evaluateeId, evaluatee.firstname AS evaluateeFirstName, evaluatee.lastname AS evaluateeLastName, evaluatee.position as evaluateePosition',
      )
      .leftJoin(User, 'evaluator', 'evaluator.id = evaluatorId')
      .leftJoin(User, 'evaluatee', 'evaluatee.id = evaluateeId')
      .groupBy('evaluateeId ')
      .addGroupBy('evaluatorId')
      .execute()

    const eventTitle = (await getRepository(Event).findOne(eventId)).title

    return getSubmissions(
      submissionModels,
      submissionSubCriteria,
      eventSubCriteriaCount,
      eventTitle,
    )
  }

  async getSubmissions(eventId: number): Promise<ISubmission[]> {
    const currentEvent = await this.eventRepository.findOne(eventId, {
      relations: ['criteria', 'criteria.subCriteria'],
    })

    let eventSubCriteriaCount = 0
    currentEvent.criteria?.forEach((criteria) => {
      eventSubCriteriaCount += criteria.subCriteria.length
    })

    const submissionSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .select('COUNT(subCriteriaResult) AS count')
      .groupBy('evaluateeId')
      .addGroupBy('evaluatorId')
      .execute()

    const submissionModels = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .select(
        'evaluatorId, evaluator.firstname AS evaluatorFirstName, evaluator.lastname AS evaluatorLastName, evaluator.position as evaluatorPosition',
      )
      .addSelect(
        'evaluateeId, evaluatee.firstname AS evaluateeFirstName, evaluatee.lastname AS evaluateeLastName, evaluatee.position as evaluateePosition',
      )
      .leftJoin(User, 'evaluator', 'evaluator.id = evaluatorId')
      .leftJoin(User, 'evaluatee', 'evaluatee.id = evaluateeId')
      .groupBy('evaluatorId')
      .addGroupBy('evaluateeId')
      .execute()

    const eventTitle = (await getRepository(Event).findOne(eventId)).title

    return getSubmissions(
      submissionModels,
      submissionSubCriteria,
      eventSubCriteriaCount,
      eventTitle,
    )
  }

  async getEventProgress(eventId: number): Promise<IEventProgress> {
    const submissions = await this.getSubmissions(eventId)

    let completedSubmissionCount = 0
    submissions.forEach((submission) =>
      submission.submissionState === SubmissionState.completed
        ? completedSubmissionCount++
        : completedSubmissionCount,
    )
    const currentEvent = await this.eventRepository.findOne(eventId)
    const eventProgress: IEventProgress = {
      progressPercentage: Number(
        ((completedSubmissionCount / submissions.length) * 100).toFixed(1),
      ),
      title: currentEvent.title,
      startDate: currentEvent.createdAt,
      endDate: currentEvent.endsAt,
    }
    return eventProgress
  }

  async getNotEvaluatedEvaluators(eventId: number): Promise<INotEvaluated[]> {
    const evaluationPairs = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .select('evaluatorId, evaluateeId, eventId')
      .groupBy('evaluatorId, evaluateeId')
      .select(
        'evaluatorId, evaluateeId, user.firstName, user.lastName, MAX(event.endsAt) as lastEvent',
      )
      .leftJoin(User, 'user', 'user.id = evaluatorId')
      .leftJoin(EventEvaluator, 'eventEvaluator', 'eventEvaluator.userId = evaluatorId')
      .leftJoin(Event, 'event', 'event.endsAt < NOW() AND event.id = eventEvaluator.eventId')
      .execute()

    return getNotEvaluatedEvaluators(evaluationPairs)
  }

  async getUserRating(eventId: number): Promise<User[]> {
    const usersRating = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .select(['evaluateeId, eventId'])
      .addSelect(['COUNT(evaluateeId) AS rating'])
      .andWhere('subCriteriaResult = true')
      .groupBy('evaluateeId')
      .getRawMany()

    const userSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .select(['evaluateeId, eventId'])
      .addSelect(['COUNT(evaluateeId) AS rating'])
      .groupBy('evaluateeId')
      .getRawMany()

    const currentEvent = await this.eventRepository.findOne(eventId, {relations: ['rating']})
    let rankingScale = 10
    currentEvent.rating?.forEach((rating) =>
      rating.isSelected ? (rankingScale = rating.to) : rankingScale,
    )

    function setRating(user) {
      for (let i = 0; i < usersRating.length; i++) {
        if (user.evaluateeId === usersRating[i].evaluateeId) {
          return ((usersRating[i].rating / userSubCriteria[i]?.rating) * rankingScale).toFixed(1)
        }
      }
    }

    const evaluatees = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .select('evaluateeId,user.rating')
      .leftJoin(User, 'user', 'evaluateeId = user.id')
      .andWhere('evaluateeId  = user.id')
      .groupBy('evaluateeId')
      .execute()

    evaluatees.forEach((user) => {
      user.rating = Number(setRating(user)) ? Number(setRating(user)) : 0
    })

    return evaluatees.sort(
      (firstEvaluatee, secondEvaluatee) => secondEvaluatee.rating - firstEvaluatee.rating,
    )
  }

  async getUserCriteriaRating(eventId: number, evaluateeId: number) {
    const usersCriteriaRating = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId})
      .andWhere({evaluateeId})
      .select('user.firstName, user.lastName')
      .addSelect(['evaluateeId, eventId,COUNT(criteriaId) as criteriaRating'])
      .leftJoin(User, 'user', 'user.id = evaluateeId')
      .andWhere('subCriteriaResult = true')
      .groupBy('criteriaId')
      .execute()

    return usersCriteriaRating
  }

  async addEvaluators(eventId: number, userId: number): Promise<void> {
    if (!isUpcomingEvent(await this.eventRepository.findOne(eventId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const eventEvaluatorRepository = await getRepository(EventEvaluator)
    ;(await eventEvaluatorRepository.createQueryBuilder().where({eventId}).getOne())
      ? (await eventEvaluatorRepository
          .createQueryBuilder()
          .where({eventId})
          .andWhere({userId})
          .getOne())
        ? logger.info('data already exists')
        : await eventEvaluatorRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId,
              eventId,
            })
            .execute()
      : logger.error("couldn't find event")
  }

  async addEvaluatees(eventId: number, userId: number) {
    if (!isUpcomingEvent(await this.eventRepository.findOne(eventId))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const eventEvaluateeRepository = await getRepository(EventEvaluatee)

    ;(await eventEvaluateeRepository.createQueryBuilder().where({eventId}).getOne())
      ? (await eventEvaluateeRepository
          .createQueryBuilder()
          .where({eventId})
          .andWhere({userId})
          .getOne())
        ? logger.info('data already exists')
        : await eventEvaluateeRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId,
              eventId,
            })
            .execute()
      : logger.error("couldn't find event")
  }

  addElement(event: Event) {
    return this.eventRepository.save(event)
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find()
  }

  findOneById(id: number): Promise<Event> {
    return this.eventRepository.findOne(id)
  }

  findByTitle(title: string): Promise<Event[]> {
    return this.eventRepository.find({title: Like(`%${title}%`)})
  }

  findAllByBonus(bonus: number): Promise<Event[]> {
    return this.eventRepository.find({where: {bonus: Like(`%${bonus}%`)}})
  }

  findAllByTimePeriod(timePeriod: Period): Promise<Event[]> {
    return this.eventRepository.find({where: {timePeriod: Like(`%${timePeriod}%`)}})
  }

  async findByEmail(email: string, eventId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {email},
    })

    try {
      await getRepository(EventEvaluator).findOne({where: {userId: user.id, eventId}})
      return user
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `There is no such an evaluator in current event`,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  async create(createEventDto: CreateEventDto): Promise<EventDto> {
    await getRepository(EventEvaluatee)
      .createQueryBuilder()
      .insert()
      .values({eventId: (await this.eventRepository.save(createEventDto)).id, userId: 0})
      .execute()
    await getRepository(EventEvaluator)
      .createQueryBuilder()
      .insert()
      .values({eventId: (await this.eventRepository.save(createEventDto)).id, userId: 0})
      .execute()
    await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .insert()
      .into(UserSubCriteria)
      .values({
        eventId: (await this.eventRepository.save(createEventDto)).id,
        criteriaId: 0,
        evaluateeId: 0,
        evaluatorId: 0,
        subCriteriaId: 0,
        subCriteriaResult: false,
        userId: 0,
        ratingId: 0,
      })
      .execute()
    createEventDto.rating = await this.ratingRepository.find({take: 3})
    return null
  }

  async update(eventId: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.preload({
      id: eventId,
      ...updateEventDto,
    })

    return this.eventRepository.save(event)
  }

  async setRating(
    evaluatorId: number,
    eventId: number,
    evaluationResult: IEvaluationResult,
  ): Promise<void> {
    if (evaluatorId === evaluationResult.evaluateeId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'User trying to evaluate himself',
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    if (
      (await getRepository(EventEvaluatee).findOne({
        where: {userId: evaluationResult.evaluateeId, eventId},
      })) === undefined
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'There is no such an evaluatee in current event',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const userSubCriteriaResults: IUserSubCriteriaResult[] = []
    let isSubCriteria: boolean
    for (const [key, value] of Object.entries(evaluationResult.Results)) {
      isSubCriteria = false
      ;(
        await this.eventRepository.findOne(eventId, {
          relations: ['criteria', 'criteria.subCriteria'],
        })
      ).criteria?.forEach((criteria) => {
        criteria.subCriteria?.forEach((subcriteria) => {
          if (subcriteria.id === Number(key)) {
            isSubCriteria = true
          }
        })
      })

      if (isSubCriteria) {
        const userSubCriteria = new UserSubCriteria()
        userSubCriteria.subCriteriaId = Number(key)
        userSubCriteria.eventId = eventId
        userSubCriteria.evaluateeId = evaluationResult.evaluateeId
        userSubCriteria.evaluatorId = evaluatorId
        userSubCriteria.criteriaId = (
          await this.subCriteriaRepository.findOneById(Number(key))
        ).criteria.id
        userSubCriteria.subCriteriaResult = value
        if (
          !(await getRepository(UserSubCriteria).findOne({
            eventId,
            evaluatorId,
            evaluateeId: evaluationResult.evaluateeId,
          }))
        ) {
          userSubCriteriaResults.push(userSubCriteria)
        } else {
          await getRepository(UserSubCriteria)
            .createQueryBuilder()
            .delete()
            .from(UserSubCriteria)
            .where({
              eventId,
              evaluatorId,
              evaluateeId: evaluationResult.evaluateeId,
            })
            .execute()
          userSubCriteriaResults.push(userSubCriteria)
        }
      }
    }

    await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .insert()
      .into(UserSubCriteria)
      .values(userSubCriteriaResults)
      .execute()
  }

  async remove(id: number): Promise<Event> {
    return this.eventRepository.remove(await this.findOneById(id))
  }
}
