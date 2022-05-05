import {Event} from '../../events/entity/event'
import {UserSubCriteria} from '../../events/entity/userSubCriteria'

export enum PerformerType {
  rockStar = 'Rock Star',
  goodPotential = 'Good Potential',
  needHelp = 'Need Help',
  waitingForEvaluation = 'Waiting For The Evaluation',
}

export interface IUser {
  id: number
  firstName: string
  lastName: string
  email: string
  rating: number
  performerType: string
  userSubCriteria: UserSubCriteria[]
  isAdmin: boolean
  salary: number
  avatar: string
  avatarPublicId: string
  events: Event[]
}
