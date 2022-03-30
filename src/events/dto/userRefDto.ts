import { IUserRef } from "../interface/userRefInterface";
import { IsInt } from "class-validator";

export class UserRefDto implements IUserRef {
    @IsInt()
    readonly id: number;
}
