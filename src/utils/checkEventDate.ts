import * as dayjs from 'dayjs'
import {Event} from '../events/entity/event'

export const isUpcomingEvent = (event: Event): boolean => {
  const now = dayjs().toDate()
  return event.createdAt < now && event.endsAt > now
}
