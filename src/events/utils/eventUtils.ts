import { InjectRepository } from "@nestjs/typeorm";
import { Event } from "../entity/event";
import { getRepository, LessThan, MoreThan, Repository } from "typeorm";
import * as dayjs from "dayjs";
import { User } from "../../users/entity/user";

export default class DateCalc {
  @InjectRepository(Event)
  static eventsRepository: Repository<Event>;

  @InjectRepository(User)
  static usersRepository: Repository<User>;

  static async getOngoingEvents(): Promise<Event[]> {
    return getRepository(Event)
      .createQueryBuilder("event")
      .where({
        createdAt: LessThan(dayjs("2022-04-10T16:40:46.993Z").toDate()),
      })
      .andWhere({
        endsAt: MoreThan(dayjs("2022-04-10T20:40:46.993Z").toDate()),
      })
      .getMany();
  }
}
