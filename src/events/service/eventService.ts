import { Inject, Injectable } from "@nestjs/common";
import { CreateEventDto } from "../dto/eventCreateDto";
import { UpdateEventDto } from "../dto/eventUpdateDto";
import { Event } from "../entity/event";
import { EventsRepository } from "../repository/eventRepository";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { IUserRef } from "../interface/userRefInterface";
import * as dayjs from "dayjs";
import { Period } from "../interface/eventInterface";
import { ISubCriteriaRef } from "../interface/subCriteriaRefInterface";
import { logger } from "../../logger";
import { Pivot } from "../entity/pivot";
import { Rating } from "../entity/rating";

@Injectable()
export class EventsService {
  @Inject()
  eventsRepository: EventsRepository;

  @InjectRepository(Rating)
  ratingRepository: Repository<Rating>;

  async addRating(Id: number, idRef: IUserRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: "DESC" },
      where: { eventId: Id },
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
        ? logger.info("data already exists")
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              ratingId: idRef.id,
              eventId: eventId,
              criteriaId: criteriaId,
              subCriteriaId: subCriteriaId,
              userId: userId,
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          ratingId: idRef.id,
          criteriaId,
          subCriteriaId,
          userId,
        });
  }

  async addCriteria(Id: number, idRef: IUserRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: "DESC" },
      where: { eventId: Id },
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
        ? logger.info("data already exists")
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              criteriaId: idRef.id,
              eventId: eventId,
              ratingId: ratingId,
              subCriteriaId: subCriteriaId,
              userId: userId,
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          criteriaId: idRef.id,
          ratingId,
          subCriteriaId,
          userId,
        });
  }

  async addSubCriteria(Id: number, idRef: ISubCriteriaRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: "DESC" },
      where: { eventId: Id, userId: idRef.userId },
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
        ? logger.info("data already exists")
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              subCriteriaId: idRef.subCriteriaId,
              eventId: eventId,
              criteriaId: criteriaId,
              ratingId: ratingId,
              userId: userId,
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          subCriteriaId: idRef.subCriteriaId,
          userId: idRef.userId,
          criteriaId,
          ratingId,
        });
  }

  async addUsers(Id: number, idRef: IUserRef) {
    const pivotRepository = await getRepository(Pivot);
    const currentPivot = await pivotRepository.findOne({
      order: { id: "DESC" },
      where: { eventId: Id },
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
        ? logger.info("data already exists")
        : await pivotRepository
            .createQueryBuilder()
            .insert()
            .values({
              userId: idRef.id,
              eventId: eventId,
              criteriaId: criteriaId,
              subCriteriaId: subCriteriaId,
              ratingId: ratingId,
            })
            .execute()
      : await pivotRepository.save({
          eventId: Id,
          userId: idRef.id,
          criteriaId,
          subCriteriaId,
          ratingId,
        });
  }

  async create(createEventDto: CreateEventDto) {
    try {
      createEventDto.endsAt = dayjs()
        .add(+createEventDto.endsAt, "day")
        .toDate();
    } catch (error) {
      logger.error(`end date doesn't created ${error.message}`);
    }
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
