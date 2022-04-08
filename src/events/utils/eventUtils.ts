import {InjectRepository} from "@nestjs/typeorm";
import {Event} from "../entity/event";
import {getRepository, LessThan, MoreThan, Repository} from "typeorm";
import * as dayjs from "dayjs";
import {User} from "../../users/entity/user";


export default class DateCalc {

    @InjectRepository(Event)
    static eventsRepository: Repository<Event>;

    @InjectRepository(User)
    static usersRepository: Repository<User>;

    static async getOngoingEvents(): Promise<Event[]> {
        return getRepository(Event).createQueryBuilder("event")
            .where({createdAt: LessThan(dayjs('2022-04-20T16:40:46.993Z').toDate())})
            .andWhere({endsAt: MoreThan(dayjs('2022-04-20T20:40:46.993Z').toDate())}).getMany()
    }

    // static async getUserRating(id: number) {
    //     const users = await this.usersRepository.find();
    //     const currentEvent = await this.eventsRepository.findOne(id);
    //    // console.log(users)
    //     const getUserRating = (events => {
    //         let j = 0;
    //         events.forEach(event => {
    //             event.criteria.forEach(criteria => {
    //                 let i = 0;
    //                 criteria.subCriteria.forEach(subCriteria => subCriteria.state && i++);
    //                 criteria.rating = i;
    //                 j += i
    //             })
    //         });
    //         return j
    //     })
    // }


    // static async getEventUserRating() {
    //     const events = await this.eventsRepository.find();
    //     return events.map(event => ({
    //         ...event,
    //         users: event.users.reduce((userRating, currentEvent) =>
    //                 currentEvent.criteria.reduce((criteriaRating, currentCriteria) =>
    //                         currentCriteria.subCriteria.reduce((subCriteriaRating, currentSubCriteria) =>
    //                                 currentSubCriteria.state ? (subCriteriaRating + 1) : subCriteriaRating,
    //                             0),
    //                     0),
    //             0),
    //     }))
    // }

    //  const inDate = (date: Date) => Between(dayjs(), dayjs());

    // if(getRepository(Event).createQueryBuilder("event")
    //     .where({ createdAt: LessThan(dayjs('2022-04-20T16:40:46.993Z').toDate()) })){
    //     if(getRepository(Event).createQueryBuilder("event")
    //         .where({ endsAt: MoreThan(dayjs('2022-04-20T16:40:46.993Z').toDate()) })){}
    // }
    //  z

    //return this.eventsRepository.find({where: {createdAt: LessThan(dayjs('2022-04-20T16:40:46.993Z').toDate()), endsAt: MoreThan(dayjs('2022-04-20T16:40:46.993Z').toDate())}})
    //return this.eventsRepository.find({where: {createdAt: createdAt < dayjs() < endsAt} ?})
    //   console.log(234524)
    //    console.log(createQueryBuilder("event")
    //        .where({ createdAt: LessThan(dayjs('2022-04-20T16:40:46.993Z').toDate()) })
    //        .andWhere(and => {and.where({ endsAt:  MoreThan(dayjs('2022-04-20T20:40:46.993Z').toDate()) })}).getMany())
    // return createQueryBuilder("event")
    //      .where({ createdAt: LessThan(dayjs('2022-04-20T16:40:46.993Z').toDate()) })
    //      .andWhere(and => {and.where({ endsAt:  MoreThan(dayjs('2022-04-20T20:40:46.993Z').toDate()) })}).getMany()
    //  return this.eventsRepository.findAll();
    //  return this.eventsRepository.findAll();
    //  return this.eventsRepository.find({where: {createdAt: createdAt<dayjs()<endsAt}? })
    //    static async getCriteriaRating(id: number){
    //         const users = await this.usersRepository.find();
    //         const currentEvent = await this.eventsRepository.findOne(id);
    //
    //         return users.map(user => ({
    //             ...user,
    //             //   rating: user.events.reduce((userRating, currentCriteria) => currentCriteria.reduce((subCriteriaRating, currentSubCriteria) =>  currentSubCriteria.state ? (subCriteriaRating + 1) : subCriteriaRating,))
    //             rating: currentEvent.criteria.reduce((userRating, currentCriteria) => {
    //                     return currentCriteria.subCriteria.reduce((subCriteriaRating, currentSubCriteria) =>
    //                             currentSubCriteria.state ? (subCriteriaRating + 1) : subCriteriaRating,
    //                         0);
    //                 },
    //                 0),
    //             //  events
    //         }))
    //     }

}
