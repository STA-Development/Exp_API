import { Injectable } from '@nestjs/common';
import { CreateEventDto } from '../dto/eventCreateDto';
import { UpdateEventDto } from '../dto/eventUpdateDto';
import { Event } from '../entity/event';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, LessThan, MoreThan, Repository } from 'typeorm';
import { Period } from '../interface/eventInterface';
import * as dayjs from 'dayjs';
import { IUserRef } from '../interface/userRefInterface';
import { Pivot } from '../entity/pivot';
import { logger } from '../../logger';
import { ISubCriteriaRef } from '../interface/subCriteriaRefInterface';
import { User } from '../../users/entity/user';
import { SubCriteria } from '../entity/subCriteria';

@Injectable()
export class EventsRepository {
  @InjectRepository(Event)
  eventRepository: Repository<Event>;

  async ongoing(): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where({
        createdAt: LessThan(dayjs().toDate())
      })
      .andWhere({
        endsAt: MoreThan(dayjs().toDate())
      })
      .getMany();
  }

  async getUserRating(Id: number): Promise<User[]> {
    const usersRating = await getRepository(Pivot)
      .createQueryBuilder()
      .where({ eventId: Id })
      .select(['userId, pivot.id'])
      .addSelect(['COUNT(userId) AS rating'])
      .leftJoin(User, 'user', 'pivot.userId = user.id')
      .leftJoin(
        SubCriteria,
        'subCriteria',
        'subCriteria.id = pivot.subCriteriaId'
      )
      .where('subCriteria.result = 1')
      .groupBy('userId')
      .execute();

    const users = await getRepository(User).find();
    users.map((user, index) => {
      return {
        ...user,
        rating:
          user.id == usersRating[index]?.userId
            ? (user.rating = Number(usersRating[index].rating))
            : user.rating
      };
    });
    return users;
  }

  async addRating(Id: number, idRef: IUserRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: 'DESC' },
      where: { eventId: Id }
    });
    const { eventId, criteriaId, subCriteriaId, userId } = currentPivot
      ? currentPivot
      : { eventId: 0, criteriaId: 0, subCriteriaId: 0, userId: 0 };
    (await pivotRepository.createQueryBuilder().where({ eventId: Id }).getOne())
      ? (await pivotRepository
          .createQueryBuilder()
          .where({ eventId: Id })
          .andWhere({ ratingId: idRef.id })
          .getOne())
        ? logger.info('data already exists')
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              ratingId: idRef.id,
              eventId: eventId,
              criteriaId: criteriaId,
              subCriteriaId: subCriteriaId,
              userId: userId
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          ratingId: idRef.id,
          criteriaId,
          subCriteriaId,
          userId
        });
  }

  async addCriteria(Id: number, idRef: IUserRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: 'DESC' },
      where: { eventId: Id }
    });
    const { eventId, ratingId, subCriteriaId, userId } = currentPivot
      ? currentPivot
      : { eventId: 0, ratingId: 0, subCriteriaId: 0, userId: 0 };
    (await pivotRepository.createQueryBuilder().where({ eventId: Id }).getOne())
      ? (await pivotRepository
          .createQueryBuilder()
          .where({ eventId: Id })
          .andWhere({ criteriaId: idRef.id })
          .getOne())
        ? logger.info('data already exists')
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              criteriaId: idRef.id,
              eventId: eventId,
              ratingId: ratingId,
              subCriteriaId: subCriteriaId,
              userId: userId
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          criteriaId: idRef.id,
          ratingId,
          subCriteriaId,
          userId
        });
  }

  async addSubCriteria(Id: number, idRef: ISubCriteriaRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: 'DESC' },
      where: { eventId: Id, userId: idRef.userId }
    });
    const { eventId, criteriaId, ratingId, userId } = currentPivot
      ? currentPivot
      : { eventId: 0, criteriaId: 0, ratingId: 0, userId: 0 };
    (await pivotRepository.createQueryBuilder().where({ eventId: Id }).getOne())
      ? (await pivotRepository
          .createQueryBuilder()
          .where({ eventId: Id })
          .andWhere({ userId: idRef.userId })
          .andWhere({ subCriteriaId: idRef.subCriteriaId })
          .getOne())
        ? logger.info('data already exists')
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              subCriteriaId: idRef.subCriteriaId,
              eventId: eventId,
              criteriaId: criteriaId,
              ratingId: ratingId,
              userId: userId
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          subCriteriaId: idRef.subCriteriaId,
          userId: idRef.userId,
          criteriaId,
          ratingId
        });
  }

  async addUsers(Id: number, idRef: IUserRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: 'DESC' },
      where: { eventId: Id }
    });
    const { eventId, criteriaId, subCriteriaId, ratingId } = currentPivot
      ? currentPivot
      : { eventId: 0, criteriaId: 0, subCriteriaId: 0, ratingId: 0 };
    (await pivotRepository.createQueryBuilder().where({ eventId: Id }).getOne())
      ? (await pivotRepository
          .createQueryBuilder()
          .where({ eventId: Id })
          .andWhere({ userId: idRef.id })
          .getOne())
        ? logger.info('data already exists')
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId: idRef.id,
              eventId: eventId,
              criteriaId: criteriaId,
              subCriteriaId: subCriteriaId,
              ratingId: ratingId
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          userId: idRef.id,
          criteriaId,
          subCriteriaId,
          ratingId
        });
  }
  addElement(event: Event) {
    return this.eventRepository.save(event);
  }
  findAll(): Promise<Event[]> {
    return this.eventRepository.find({
      relations: [
        'pivot',
        'pivot.criteria',
        'pivot.subCriteria',
        'pivot.rating',
        'pivot.user'
      ]
    });
  }

  findAllByTitle(title: string): Promise<Event[]> {
    return this.eventRepository.find({
      relations: [
        'pivot',
        'pivot.criteria',
        'pivot.subCriteria',
        'pivot.rating',
        'pivot.user'
      ],
      where: { title: title }
    });
  }

  async findOneById(id: number): Promise<Event> {
    let event;
    event = await this.eventRepository.findOne(id, {
      relations: [
        'pivot',
        'pivot.criteria',
        'pivot.subCriteria',
        'pivot.rating',
        'pivot.user'
      ]
    });

    return event;
  }

  async findOneByTitle(title: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      relations: [
        'pivot',
        'pivot.criteria',
        'pivot.subCriteria',
        'pivot.rating',
        'pivot.user'
      ],
      where: { title: title }
    });

    return event;
  }

  async findOneByTimePeriod(timePeriod: Period): Promise<Event> {
    const event = await this.eventRepository.findOne({
      relations: [
        'pivot',
        'pivot.criteria',
        'pivot.subCriteria',
        'pivot.rating',
        'pivot.user'
      ],
      where: { timePeriod: timePeriod }
    });

    return event;
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    return this.eventRepository.save(createEventDto);
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

  async remove(id: number): Promise<Event> {
    const event = await this.findOneById(id);
    return this.eventRepository.remove(event);
  }
}
