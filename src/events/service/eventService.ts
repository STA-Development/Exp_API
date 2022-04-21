import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common'
import * as dayjs from 'dayjs'
import {CreateEventDto} from '../dto/eventCreateDto'
import {UpdateEventDto} from '../dto/eventUpdateDto'
import {Event, EventDto} from '../entity/event'
import {EventsRepository} from '../repository/eventRepository'
import {logger} from '../../logger'
import {User} from '../../users/entity/user'
import {elementIdDto} from '../dto/elementIdDto'
import {RatingRepository} from '../repository/ratingRepository'
import {CriteriaRepository} from '../repository/criteriaRepository'
import {UserRepository} from '../../users/repository/userRepository'
import {IEventSearch} from '../interface/eventSearchInterface'
import {ISubCriteriaRef} from '../interface/subCriteriaRefInterface'
import {isUpcomingEvent} from '../../utils/checkEventDate'

@Injectable()
export class EventsService {
  @Inject()
  eventsRepository: EventsRepository

  @Inject()
  ratingRepository: RatingRepository

  @Inject()
  criteriaRepository: CriteriaRepository

  @Inject()
  userRepository: UserRepository

  getOngoingEvents(): Promise<Event[]> {
    return this.eventsRepository.getOngoingEvents()
  }

  getUserRating(eventId: number): Promise<User[]> {
    return this.eventsRepository.getUserRating(eventId)
  }

  async addRating(eventId: number, ratingRef: elementIdDto) {
    const rating = await this.ratingRepository.findOneById(ratingRef.id)
    const event = await this.eventsRepository.findOneById(eventId)
    if (!isUpcomingEvent(event))
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
    !event.rating ? (event.rating = [rating]) : event.rating.push(rating)

    return this.eventsRepository.addElement(event)
  }

  async addCriteria(eventId: number, criteriaRef: elementIdDto) {
    const criteria = await this.criteriaRepository.findOneById(criteriaRef.id)
    const event = await this.eventsRepository.findOneById(eventId)
    if (!isUpcomingEvent(event))
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Cannot make changes in event',
        },
        HttpStatus.BAD_REQUEST,
      )
    !event.criteria ? (event.criteria = [criteria]) : event.criteria.push(criteria)
    return this.eventsRepository.addElement(event)
  }

  async addSubCriteria(Id: number, idRef: ISubCriteriaRef) {
    await this.eventsRepository.addSubCriteria(Id, idRef)
  }

  addEvaluators(Id: number, idRef: elementIdDto) {
    return this.eventsRepository.addEvaluators(Id, idRef)
  }

  addEvaluatees(Id: number, idRef: elementIdDto) {
    return this.eventsRepository.addEvaluatees(Id, idRef)
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.findAll()
  }

  search(params: IEventSearch): Promise<Event[]> {
    if (params.title) return this.eventsRepository.findAllByTitle(params.title)
    if (params.bonus) return this.eventsRepository.findAllByBonus(params.bonus)
    if (params.timePeriod) return this.eventsRepository.findAllByTimePeriod(params.timePeriod)
  }

  findOneById(id: number): Promise<Event> {
    return this.eventsRepository.findOneById(id)
  }

  create(createEventDto: CreateEventDto): Promise<EventDto> {
    try {
      createEventDto.endsAt = dayjs().add(Number(createEventDto.endsAt), 'day').toDate()
    } catch (error) {
      logger.error(`end date doesn't created ${error.message}`)
    }
    return this.eventsRepository.create(createEventDto)
  }

  update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventsRepository.update(id, updateEventDto)
  }

  remove(id: number): Promise<Event> {
    return this.eventsRepository.remove(id)
  }
}
