import * as dayjs from 'dayjs'
import {Event} from '../events/entity/event'
import * as isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(isBetween)

export const isUpcomingEvent = (event: Event): boolean => {
  return dayjs().isBetween(event.createdAt, event.endsAt)
}
