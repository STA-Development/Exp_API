import { Inject, Injectable } from "@nestjs/common";
import { CreateEventDto } from "../dto/eventCreateDto";
import { UpdateEventDto } from "../dto/eventUpdateDto";
import { Event } from "../entity/event";
import { EventsRepository } from "../repository/eventRepository";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../entity/user";
import {IUserRef} from "../interface/userRefInterface";
import * as dayjs from "dayjs";
import {log} from "util";
import {Period} from "../interface/eventInterface";


@Injectable()
export class EventsService {

  @Inject()
  eventsRepository: EventsRepository;

  @InjectRepository(User)
  userRepository: Repository<User>;


  async addUsers(eventId: number, userRef: IUserRef) {
    const user = await this.userRepository.findOne(userRef.id)
    const event = await this.eventsRepository.findOneById(eventId)
    event.users.push(user)

    return this.eventsRepository.addUsers(event)
  }

  async create(createEventDto: CreateEventDto) {
    createEventDto.endsAt = dayjs().add( +createEventDto.endsAt, 'day').toDate();
    const user = await this.eventsRepository.create(createEventDto);
    return this.eventsRepository.create(user);
  }

  async findAll(): Promise<Event[]> {
    return this.eventsRepository.findAll();
  }

  async findAllByTitle(title: string): Promise<Event[]> {
    return this.eventsRepository.findAllByTitle(title);
  }

  async findOneById(id: number): Promise<Event> {
    // if (!event) {
    //   throw new NotFoundException(`User with ID=${id} not found`);
    // }
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
