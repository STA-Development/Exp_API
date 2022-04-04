import {Event} from "../entity/event";

export interface IRating {
    from: number;
    to: number;
    isSelected: boolean;
    events: Event[];
}
