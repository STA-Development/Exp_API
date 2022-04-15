import { Inject, Injectable, Param } from '@nestjs/common';
import { CreateEventDto } from '../dto/eventCreateDto';
import { UpdateEventDto } from '../dto/eventUpdateDto';
import { Event } from '../entity/event';
import { EventsRepository } from '../repository/eventRepository';
import { IUserRef } from '../interface/userRefInterface';
import * as dayjs from 'dayjs';
import { Period } from '../interface/eventInterface';
import { ISubCriteriaRef } from '../interface/subCriteriaRefInterface';
import { logger } from '../../logger';
import { User } from '../../users/entity/user';
import { elementIdDto } from '../dto/elementIdDto';
import { RatingRepository } from '../repository/ratingRepository';
import { CriteriaRepository } from '../repository/criteriaRepository';
import { UserRepository } from '../../users/repository/userRepository';

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

  async ongoing(): Promise<Event[]> {
    return this.eventsRepository.ongoing();
  }

  async getUserRating(eventId: number): Promise<User[]> {
    return await this.eventsRepository.getUserRating(eventId);
  }

  async addRating(eventId: number, ratingRef: elementIdDto) {
    const rating = await this.ratingRepository.findOneById(ratingRef.id);
    const event = await this.eventsRepository.findOneById(eventId);
    if (event.rating == null) {
      event.rating = [rating];
    } else {
      event.rating.push(rating);
    }
    return this.eventsRepository.addElement(event);
  }

  async addCriteria(eventId: number, criteriaRef: elementIdDto) {
    const criteria = await this.criteriaRepository.findOneById(criteriaRef.id);
    const event = await this.eventsRepository.findOneById(eventId);
    if (event.rating == null) {
      event.criteria = [criteria];
    } else {
      event.criteria.push(criteria);
    }
    return this.eventsRepository.addElement(event);
  }

  async addSubCriteria(Id: number, idRef: ISubCriteriaRef) {
    await this.eventsRepository.addSubCriteria(Id, idRef);
  }

  async addUsers(eventId: number, userRef: IUserRef) {
    const user = await this.userRepository.findOne(userRef.id); //xi findOne?
    const event = await this.eventsRepository.findOneById(eventId);
    if (event.rating == null) {
      event.users = [user];
    } else {
      event.users.push(user);
    }

    return this.eventsRepository.addElement(event);
  }
  //
  // async addRating(eventId: number, criteriaRef: ICriteriaRef) {
  //   const rating = await this.ratingRepository.findOne(criteriaRef.id);
  //   const event = await this.eventsRepository.findOneById(eventId);
  //   if (event.rating == null) {
  //     event.rating = [rating];
  //   } else {
  //     event.rating.push(rating);
  //   }
  //   return this.eventsRepository.addElement(event); // @ndharacnenq addusers@
  // }
  //
  // async addCriteria(eventId: number, criteriaRef: ICriteriaRef) {
  //   const criteria = await this.criteriaRepository.findOne(criteriaRef.id);
  //   const event = await this.eventsRepository.findOneById(eventId);
  //   event.criteria.push(criteria);
  //   return this.eventsRepository.addElement(event);
  // }
  //
  // async addUsers(eventId: number, userRef: IUserRef) {
  //   const user = await this.userRepository.findOne(userRef.id);
  //   const event = await this.eventsRepository.findOneById(eventId);
  //   event.users.push(user);
  //
  //   return this.eventsRepository.addElement(event);
  // }
  //
  async create(createEventDto: CreateEventDto) {
    try {
      createEventDto.endsAt = dayjs()
        .add(Number(createEventDto.endsAt), 'day')
        .toDate();
    } catch (error) {
      logger.error(`end date doesn't created ${error.message}`);
    }
    // createEventDto.rating = await this.ratingRepository.find({ take: 3 }); //TODO seed event
    return this.eventsRepository.create(createEventDto);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.findAll();
  }

  async findAllByTitle(title: string): Promise<Event[]> {
    return this.eventsRepository.findAllByTitle(title);
  }

  async findOneById(id: number): Promise<Event> {
    return this.eventsRepository.findOneById(id);
  }

  async findOneByTitle(title: string): Promise<Event> {
    return this.eventsRepository.findOneByTitle(title);
  }

  async findOneByTimePeriod(TimePeriod: Period): Promise<Event> {
    return this.eventsRepository.findOneByTimePeriod(TimePeriod);
  }

  update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    return this.eventsRepository.update(id, updateEventDto);
  }

  remove(id: number): Promise<Event> {
    return this.eventsRepository.remove(id);
  }
}
