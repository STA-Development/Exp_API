import {
    IsString,
    IsBoolean,
    IsOptional, IsInt,
} from "class-validator";
import {Event} from "../entity/event";

export class CreateRatingDto {

    @IsInt()
    readonly from: number;

    @IsInt()
    readonly to: number;

    @IsBoolean()
    readonly isSelected: boolean;

    @IsOptional()
    readonly events: Event[];
}
