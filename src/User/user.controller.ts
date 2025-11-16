import { userService } from "./user.service"
import { IControllerContract } from "./user.types";


export const userController: IControllerContract = {
    login: async (req, res) => {
        const resp = await userService.login(req.body)
        if(resp.status == "error"){
            res.status(resp.code).json({message: resp.message})
        }
        res.status(200).json(resp.dataAuth)
    },
    register: async (req, res) => {
        const resp = await userService.register(req.body)
        if(resp.status == "error"){
            res.status(resp.code).json({message: resp.message})
        }
        res.status(200).json(resp.dataAuth)
    },
    me: async (req, res) => {
        if(req.body){
            console.log("yes")
        }
        const resp = await userService.me(res.locals.userId)
        if(resp.status == "error"){
            res.status(resp.code).json({message: resp.message})
        }
        res.status(200).json(resp.dataUser)
    }
}
