import { IUserRef } from "../interface/userRefInterface";
import {IsInt, IsString} from "class-validator";
import {ISubCriteriaRef} from "../interface/subCriteriaRefInterface";

export class SubCriteriaRefDto implements ISubCriteriaRef {
    @IsInt()
    readonly id: number;
}
