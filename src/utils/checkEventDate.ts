import * as dayjs from 'dayjs'
import {Event} from '../events/entity/event'

export const isUpcomingEvent = (event: Event): boolean => {
  const a = dayjs().toDate()
  return event.createdAt < a && event.endsAt > a
}
