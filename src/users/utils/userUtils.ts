import {InjectRepository} from "@nestjs/typeorm";
import {getRepository, Repository} from "typeorm";
import {User} from "../entity/user";
import {Event} from "../../events/entity/event"

export default class UserUtils {

    @InjectRepository(Event)
    static eventsRepository: Repository<Event>;

    @InjectRepository(User)
    static usersRepository: Repository<User>;


    static async getUserRating(eventId: number) {
        const users = await getRepository("User").find({relations:["events", "criteria", "criteria.subCriteria"]}) as User[]
        return users.map(user => {
            return ({
                ...user,
                rating: (user.criteria.reduce((criteriaRating, currentCriteria) =>
                                criteriaRating + currentCriteria.subCriteria.reduce((subCriteriaRating, currentSubCriteria) =>
                            {currentSubCriteria.state ? (subCriteriaRating += 1): subCriteriaRating;
                               // subCriteriaCount++;
                                return subCriteriaRating},
                                    0),
                                0)) //* (currentEvent.bonus ? (currentEvent.bonus / 100): 1) / subCriteriaCount * 100 / +av[1] * 100).toFixed(1)
                    })
            })

        //return users
        // const currentEvent = await getRepository("Event").findOne(eventId,{relations:["users", "users.criteria", "users.criteria.subCriteria", "rating"]}) as Event
        // let subCriteriaCount = 0;let av =[];
        // let o = currentEvent.rating?.map(rating => {rating.isSelected ?  av = [rating.from, rating.to ]: av
        //     return rating.from})
        // console.log(av[0], av[1])
        // return currentEvent.users?.map(user => {
        //     return ({
        //         ...user,
        //         rating: +((user.criteria.reduce((criteriaRating, currentCriteria) =>
        //                 criteriaRating + currentCriteria.subCriteria.reduce((subCriteriaRating, currentSubCriteria) =>
        //             {currentSubCriteria.state ? (subCriteriaRating += 1): subCriteriaRating;
        //                 subCriteriaCount++;
        //                 return subCriteriaRating},
        //                     0),
        //                 0)) * (currentEvent.bonus ? (currentEvent.bonus / 100): 1) / subCriteriaCount * 100 / +av[1] * 100).toFixed(1)
        //     });
        // })
    }

    static async getUserCriteriaRating(eventId: number) {
        const currentEvent = await getRepository("Event").findOne(eventId,{relations:["users", "users.criteria", "users.criteria.subCriteria"]}) as Event
         return currentEvent.users.map(user => user.criteria.map(criteria =>   ({
            ...criteria,
            rating: +((criteria.subCriteria.reduce((subCriteriaRating, currentSubCriteria) =>
                currentSubCriteria.state ? (subCriteriaRating + 1): subCriteriaRating, 0)) * (currentEvent.bonus ? (currentEvent.bonus / 100): 1)).toPrecision(3)
        })))
    }

}
