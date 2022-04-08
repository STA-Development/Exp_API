import {IsInt} from "class-validator";
import {IIdRefDto} from "../interface/subCriteriaRefInterface";

export class idRefDto implements IIdRefDto {
    @IsInt()
    readonly id: number;
}
