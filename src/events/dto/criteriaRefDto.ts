import { IsInt } from "class-validator";
import {ICriteriaRef} from "../interface/criteriaRefInterface";

export class CriteriaRefDto implements ICriteriaRef {     //Cannot extend an interface 'IUserRef'. Did you mean 'implements
    @IsInt()                                              // mi hat interface karanq unenanq
    readonly id: number;                                  //xi enq class sarqum??
}
