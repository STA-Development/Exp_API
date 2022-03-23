import { Event } from "../entity/event";

export const eventGetDto = (event: Event): Event => ({
  id: event.id,
  title: event.title,
  bonus: event.bonus,
  rating: event.rating,
  TimePeriod: event.TimePeriod,
  users: event.users,
  createdAt: event.createdAt,
  endsAt: event.endsAt,
  // criteria: event.criteria
});
