import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { User } from "../entity/user";
import { Event } from "../../events/entity/event";
import { Pivot } from "../../events/entity/pivot";
import { SubCriteria } from "../../events/entity/subCriteria";

export default class UserUtils {
  @InjectRepository(Event)
  static eventsRepository: Repository<Event>;

  @InjectRepository(User)
  static usersRepository: Repository<User>;

  static async getUserRating(Id: number) {
    const usersRating = await getRepository(Pivot)
      .createQueryBuilder()
      .where({ eventId: Id })
      .select(["userId, pivot.id"])
      .addSelect(["COUNT(userId) AS rating"]) //distinct
      .leftJoin(User, "user", "pivot.userId = user.id")
      .leftJoin(
        SubCriteria,
        "subCriteria",
        "subCriteria.id = pivot.subCriteriaId"
      )
      //  .loadRelationCountAndMap("rating", "subCriteria")
      .where("subCriteria.state=1")
      // .addSelect("subCriteria.id", "id")
      .groupBy("userId")
      .execute();
    console.log(usersRating);
    const users = await getRepository(User).find();
    users.map((user, index) => {
      return {
        ...user,
        rating:
          user.id == usersRating[index].userId
            ? (user.rating = +usersRating[index].rating)
            : user.rating,
      };
    });
    return users;
  }

  static async getUserCriteriaRating(eventId: number) {
    return (await getRepository("Event").findOne(eventId, {
      relations: ["users", "users.criteria", "users.criteria.subCriteria"],
    })) as Event;
  }
}
