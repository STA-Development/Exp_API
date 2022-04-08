import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "../dto/eventCreateDto";
import { UpdateEventDto } from "../dto/eventUpdateDto";
import { Event } from "../entity/event";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {Period} from "../interface/eventInterface";

@Injectable()
export class EventsRepository {

  @InjectRepository(Event)
  eventRepository: Repository<Event>;

  addElement(event:Event) {
    return this.eventRepository.save(event)
  }

  create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.save(createEventDto);
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: [ "users", "rating", "criteria", "criteria.subCriteria" ] });
  }

  findAllByTitle(title: string): Promise<Event[]> {
    return this.eventRepository.find({
      relations: [ "users", "rating", "criteria", "criteria.subCriteria" ], where: { title: title } });     /////
  }

  async findOneById(id: number): Promise<Event> {
    let event;
      event = await this.eventRepository.findOne(id,
        {relations: ["users", "rating", "criteria", "criteria.subCriteria"],});

    return event;
  }

  async findOneByTitle(title: string): Promise<Event> {
    const event = await this.eventRepository.findOne(  {
      relations: [ "users", "criteria", "criteria.subCriteria" ],
      where: { title: title }
    });

    return event;
  }

  async findOneByTimePeriod(TimePeriod: Period): Promise<Event> {
    const event = await this.eventRepository.findOne(  {
      relations: [ "users", "criteria", "criteria.subCriteria" ],
      where: { TimePeriod: TimePeriod }
    });

    return event;
  }

  async update(eventId: number, updateEventDto: UpdateEventDto): Promise<Event> {

    const event = await this.eventRepository.preload({
      id: eventId,
      ...updateEventDto,
    });

    return this.eventRepository.save(event);
  }

  async remove(id: number): Promise<Event> {

    const event = await this.findOneById(id);
    return this.eventRepository.remove(event);
  }

}
