
import type { ServiceResponse, IServiceContract} from "./user.types"

import { userRepository } from "./user.repository";
import { sign } from "jsonwebtoken";
import { ENV } from "../config/env";
import { compare, hash } from "bcrypt";


export const userService: IServiceContract = {
    login: async (body) => {
        const user = await userRepository.findByEmail(body.email)
        if(!user){
            const respon: ServiceResponse = {
                status: "error",
                message: "user not found",
                code: 404
            }
            return respon
        }
        const isTruePassword = await compare(body.password, user.password);
        if(!isTruePassword){
            const respon: ServiceResponse = {
                status: "error",
                message: "Wrong data",
                code: 401
            }
            return respon
        }
        const tocken = sign({id: user.id},ENV.SECRET_KEY,{
            expiresIn: "7d"
        })
        const respon: ServiceResponse = {
            status: "success",
            message: "success",
            code: 200,
            dataAuth: {tocken: tocken}
        }
        return respon
    },
    register: async (body) => {
        let allEllBody ={...body}
        const user = await userRepository.findByEmail(body.email)
        if(user){
            const respon: ServiceResponse = {
                status: "error",
                message: "User already exists",
                code: 401
            }
            return respon
        }
        if(!allEllBody.avatar||!allEllBody.firstName||!allEllBody.secondName||!allEllBody.password){
            const respon: ServiceResponse = {
                status: "error",
                message: "Wrong data",
                code: 401
            }
            return respon
        }
        const hashedPassword = await hash(body.password, 10);
		const dataWithHashedPassword = {
			...body,
			password: hashedPassword
		}
        const createUser = await userRepository.create(dataWithHashedPassword);
        if(typeof createUser === "string"){
            const respon: ServiceResponse = {
                status: "error",
                message: createUser,
                code: 500
            }
            return respon
        }

        const tocken = sign({id: createUser.id},ENV.SECRET_KEY,{
            expiresIn: "7d"
        })
        const respon: ServiceResponse = {
            status: "success",
            code: 200,
            message: "success",
            dataAuth: {tocken: tocken}
        }
        return respon

    },
    me: async (id) => {
        const userMe = await userRepository.findByIdWithoutPassword(id)
        if(!userMe){
            const respon: ServiceResponse = {
                status: "error",
                message: "user not found",
                code: 404
            }
            return respon
        }
        const respon: ServiceResponse = {
            status: "success",
            dataUser: userMe,
            message: "success",
            code:200
        }
        return respon
    }    
};