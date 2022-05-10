import * as dayjs from 'dayjs'
import * as isBetween from 'dayjs/plugin/isBetween'
import {Event} from '../events/entity/event'

dayjs.extend(isBetween)

export const isUpcomingEvent = (event: Event): boolean =>
  dayjs().isBetween(event.createdAt, event.endsAt)
