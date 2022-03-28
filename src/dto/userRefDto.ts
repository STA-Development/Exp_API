import { IUserRef } from "../interface/userRefInterface";
import {IsInt, IsString} from "class-validator";

export class UserRefDto implements IUserRef {  //Cannot extend an interface 'IUserRef'. Did you mean 'implements
    @IsInt()
    readonly id: number;
}
