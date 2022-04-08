import { Inject, Injectable } from "@nestjs/common";
import { CreateEventDto } from "../dto/eventCreateDto";
import { UpdateEventDto } from "../dto/eventUpdateDto";
import { Event } from "../entity/event";
import { EventsRepository } from "../repository/eventRepository";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../users/entity/user";
import {IUserRef} from "../interface/userRefInterface";
import * as dayjs from "dayjs";
import {Period} from "../interface/eventInterface";
import {ICriteriaRef} from "../interface/criteriaRefInterface";
import {Criteria} from "../entity/criteria";
import {Rating} from "../entity/rating";
import {logger} from "../../logger";

@Injectable()
export class EventsService {

  @Inject()
  eventsRepository: EventsRepository;

  @InjectRepository(User)
  userRepository: Repository<User>;

  @InjectRepository(Criteria)
  criteriaRepository: Repository<Criteria>;

  @InjectRepository(Rating)
  ratingRepository: Repository<Rating>;

  async addRating(eventId: number, criteriaRef: ICriteriaRef) {
    const rating = await this.ratingRepository.findOne(criteriaRef.id)
    const event = await this.eventsRepository.findOneById(eventId)
    if(event.rating == null){
      event.rating = [rating]
    }
    else{
      event.rating.push(rating)
    }
    return this.eventsRepository.addElement(event)       // @ndharacnenq addusers@
  }

  async addCriteria(eventId: number, criteriaRef: ICriteriaRef) {
    const criteria = await this.criteriaRepository.findOne(criteriaRef.id)
    const event = await this.eventsRepository.findOneById(eventId)
    event.criteria.push(criteria)
    return this.eventsRepository.addElement(event)
  }

  async addUsers(eventId: number, userRef: IUserRef) {
    const user = await this.userRepository.findOne(userRef.id)
    const event = await this.eventsRepository.findOneById(eventId)
    event.users.push(user)

    return this.eventsRepository.addElement(event)
  }

  async create(createEventDto: CreateEventDto) {
    try { createEventDto.endsAt = dayjs().add(+createEventDto.endsAt, 'day').toDate(); }
    catch(error){
      logger.error(`end date doesn't created ${error.message}`)
    }
    createEventDto.rating = await this.ratingRepository.find({take: 3})
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
