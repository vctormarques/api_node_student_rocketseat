import {Request, Response, NextFunction} from "express"
import { verify } from "jsonwebtoken"

interface IPayload{
    sub: string;
}
export function ensureAuthenticated(request: Request, response: Response, next: NextFunction){

    const authToken = request.headers.authorization;

    if(!authToken){
        return response.status(401).json({ 
            message: "Invalid token"
        });
    }

    const [,token] = authToken.split(" ")

    try{
        const { sub } = verify(token, "3ec2375262c8fac40f0e3dd2aa6fe939") as IPayload;
        
        request.user_id = sub;

        return next();
    } catch(err){
        return response.status(401).end();
    }


}