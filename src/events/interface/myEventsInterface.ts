import { EventEvaluator } from "../entity/eventEvaluator";
import { EventEvaluatee } from "../entity/eventEvaluatee";
import {EventStatus} from "../../enums/eventStatus";

export interface IMyEvents {
  status: EventStatus;
  title: string;
  startsAt: Date;
}
