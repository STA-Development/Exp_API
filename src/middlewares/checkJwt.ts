import * as jwt from "jsonwebtoken";
import {CanActivate, ExecutionContext} from "@nestjs/common";

export class AuthGuard implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()



        console.log(111111, req.headers['authorization'])
        // const token = req.headers
        const token = req.headers.authorization.split(' ');



        try {
            console.log(1111)
            console.log(token[1])

             const jwtPayload = jwt.verify(token[1], process.env.JWT_ACCESS);
            console.log(jwtPayload)

            return true;
        } catch (error) {


            return false ;
        }
    }
}