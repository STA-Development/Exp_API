import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {getRepository, LessThan, MoreThan, Repository} from 'typeorm'
import * as dayjs from 'dayjs'
import {CreateEventDto} from '../dto/eventCreateDto'
import {UpdateEventDto} from '../dto/eventUpdateDto'
import {Event, EventDto} from '../entity/event'
import {Period} from '../interface/eventInterface'
import {UserSubCriteria} from '../entity/userSubCriteria'
import {User} from '../../users/entity/user'
import {SubCriteria} from '../entity/subCriteria'
import {Rating} from '../entity/rating'
import {EventEvaluator} from '../entity/eventEvaluator'
import {logger} from '../../logger'
import {EventEvaluatee} from '../entity/eventEvaluatee'
import {ISubCriteriaRef} from '../interface/subCriteriaRefInterface'
import {isUpcomingEvent} from '../../utils/checkEventDate'

@Injectable()
export class EventsRepository {
  @InjectRepository(Event)
  eventRepository: Repository<Event>

  @InjectRepository(User)
  userRepository: Repository<User>

  @InjectRepository(Rating)
  ratingRepository: Repository<Rating>

  async getOngoingEvents(): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where({
        createdAt: LessThan(dayjs().toDate()),
      })
      .andWhere({
        endsAt: MoreThan(dayjs().toDate()),
      })
      .getMany()
  }

  async addSubCriteria(Id: number, idRef: ISubCriteriaRef) {
    const userSubCriteriaRepository = await getRepository(UserSubCriteria)
    const userSubCriteria = await userSubCriteriaRepository.findOne({
      order: {id: 'DESC'},
      where: {eventId: Id},
    })

    const {eventId, criteriaId, ratingId, userId} = userSubCriteria || {
      eventId: 0,
      criteriaId: 0,
      ratingId: 0,
      userId: 0,
    }

    const userSubCriterias = []
    for (let i = 0; i < idRef.subCriteriaId.length; i++) {
      const userSubCriteria = new UserSubCriteria()
      userSubCriteria.subCriteriaId = idRef.subCriteriaId[i]
      userSubCriteria.eventId = Id
      userSubCriteria.criteriaId = criteriaId
      userSubCriteria.ratingId = ratingId
      userSubCriteria.userId = idRef.userId
      !(await userSubCriteriaRepository.findOne(userSubCriteria))
        ? userSubCriterias.push(userSubCriteria)
        : logger.info('data already exists')
    }

    if (await userSubCriteriaRepository.createQueryBuilder().where({eventId: Id}).getOne())
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

  async getUserRating(Id: number): Promise<User[]> {
    const usersRating = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId: Id})
      .select(['userSubCriteria.userId, userSubCriteria.id'])
      .addSelect(['COUNT(userSubCriteria.userId) AS rating'])
      .leftJoin(User, 'user', 'userSubCriteria.userId = user.id')
      .leftJoin(SubCriteria, 'subCriteria', 'subCriteria.id = userSubCriteria.subCriteriaId')
      .leftJoin(EventEvaluatee, 'eventEvaluatee', 'eventEvaluatee.userId = userSubCriteria.userId')
      .where('subCriteria.result = 1')
      .andWhere('userSubCriteria.userId = eventEvaluatee.userId')
      .groupBy('userSubCriteria.userId')
      .execute()

    const userSubCriteria = await getRepository(UserSubCriteria)
      .createQueryBuilder()
      .where({eventId: Id})
      .select(['userId, userSubCriteria.id'])
      .addSelect(['COUNT(userId) AS rating'])
      .leftJoin(User, 'user', 'userSubCriteria.userId = user.id')
      .leftJoin(SubCriteria, 'subCriteria', 'subCriteria.id = userSubCriteria.subCriteriaId')
      .where('subCriteria.result = true OR subCriteria.result = false')
      .groupBy('userId')
      .getRawMany()

    const currentEvent = await this.findOneById(Id)
    let rankingScale = 10
    currentEvent.rating?.map((rating) => {
      rating.isSelected ? (rankingScale = rating.to) : rankingScale
      return rankingScale
    })

    const users = await getRepository(User).find()
    function setRating(user) {
      for (let i = 0; i < usersRating.length; i++) {
        if (user.id === usersRating[i].userId) {
          return (
            ((((usersRating[i].rating * currentEvent.bonus ? currentEvent.bonus / 100 : 1) /
              userSubCriteria[i].rating) *
              100) /
              rankingScale) *
            100
          ).toFixed(5)
        }
      }
    }

    users.forEach((user) => {
      user.rating = Number(setRating(user)) ? Number(setRating(user)) : 0
    })

    return users
  }

  async addEvaluators(Id: number, userId: number) {
    if (!isUpcomingEvent(await this.eventRepository.findOne(Id))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const eventEvaluatorRepository = await getRepository(EventEvaluator)
    const currentPivot = await eventEvaluatorRepository.findOne({
      order: {id: 'DESC'},
      where: {eventId: Id},
    })
    const {eventId} = currentPivot || {eventId: 0}
    ;(await eventEvaluatorRepository.createQueryBuilder().where({eventId: Id}).getOne())
      ? (await eventEvaluatorRepository
          .createQueryBuilder()
          .where({eventId: Id})
          .andWhere({userId: userId})
          .getOne())
        ? logger.info('data already exists')
        : await eventEvaluatorRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId: userId,
              eventId,
            })
            .execute()
      : logger.error("couldn't find event")
  }

  async addEvaluatees(Id: number, userId: number) {
    if (!isUpcomingEvent(await this.eventRepository.findOne(Id))) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
    }
    const eventEvaluateeRepository = await getRepository(EventEvaluatee)
    const currentPivot = await eventEvaluateeRepository.findOne({
      order: {id: 'DESC'},
      where: {eventId: Id},
    })
    const {eventId} = currentPivot || {eventId: 0}
    ;(await eventEvaluateeRepository.createQueryBuilder().where({eventId: Id}).getOne())
      ? (await eventEvaluateeRepository
          .createQueryBuilder()
          .where({eventId: Id})
          .andWhere({userId: userId})
          .getOne())
        ? logger.info('data already exists')
        : await eventEvaluateeRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId: userId,
              eventId,
            })
            .execute()
      : logger.error("couldn't find event")
  }

  addElement(event: Event) {
    return this.eventRepository.save(event)
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: [
        'criteria',
        'rating',
        'eventEvaluator',
        'eventEvaluator.user',
        'eventEvaluatee',
        'eventEvaluatee.user',
      ],
    })
  }

  async findOneById(id: number): Promise<Event> {
    return this.eventRepository.findOne(id, {
      relations: ['criteria', 'rating', 'users'],
    })
  }

  async findAllByTitle(title: string): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.title like :title', {title: `%${title}%`})
      .getMany()
  }

  async findAllByBonus(bonus: number): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.bonus like :bonus', {bonus: `%${bonus}%`})
      .getMany()
  }

  async findAllByTimePeriod(timePeriod: Period): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where('event.timePeriod like :timePeriod', {
        timePeriod: `%${timePeriod}%`,
      })
      .getMany()
  }

  async create(createEventDto: CreateEventDto): Promise<EventDto> {
    createEventDto.rating = await this.ratingRepository.find({take: 3})
    return this.eventRepository.save(createEventDto)
  }

  async update(eventId: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.preload({
      id: eventId,
      ...updateEventDto,
    })

    return this.eventRepository.save(event)
  }

  async remove(id: number): Promise<Event> {
    const event = await this.findOneById(id)
    return this.eventRepository.remove(event)
  }
}
