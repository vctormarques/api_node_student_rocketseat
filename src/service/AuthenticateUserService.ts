import { getCustomRepository } from "typeorm"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import { UsersRepositories } from "../repositories/UserRepositories"

interface IAuthenticateRequest {
    email: string;
    password: string;
}

class AuthenticateUserService {

    async execute({email, password}: IAuthenticateRequest){

        const usersRepositories = getCustomRepository(UsersRepositories);

        //Verificando se existe o email
        const user = await usersRepositories.findOne({
            email
        })

        if(!user){
            throw new Error("Email/Password incorrect");
        }
        
        //Comparando senha se está correta
        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch){
            throw new Error("Email/Password incorrect");
        }

        //Gerar Token
        const token = sign({
            email: user.email
        }, "3ec2375262c8fac40f0e3dd2aa6fe939", {
            subject: user.id,
            expiresIn: "1d"
        });
        
        return token;
    }

 }

export { AuthenticateUserService } 
