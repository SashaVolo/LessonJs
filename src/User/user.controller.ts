import { Request, Response } from "express"; 
import { userService } from "./user.service";
import { IControllerContract, ServiceResponse, UpdateAvatarInput } from "./user.types";

export const userController: IControllerContract = {

    updateAvatar: async (
        req: Request<object, ServiceResponse, UpdateAvatarInput>, 
        res: Response<ServiceResponse>
    ) => {
        const userId = Number(res.locals.userId); 
        const { avatar } = req.body;

        if (!avatar) {
             res.status(400).json({ 
                 status: "error", 
                 message: "Avatar is required", 
                 code: 400 
             });
             return;
        }

        const result = await userService.updateAvatar(userId, avatar);
        res.status(result.code).json(result);
    },

    login: async (req, res) => {
        const resp = await userService.login(req.body);
        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return; 
        }

        res.status(200).json(resp.dataAuth as any); 
    },

    register: async (req, res) => {
        const resp = await userService.register(req.body);
        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return; 
        }
        res.status(200).json(resp.dataAuth as any);
    },

    me: async (_req, res) => {
        const userId = Number(res.locals.userId);
        const resp = await userService.me(userId);
        
        if (resp.status === "error") {
            res.status(resp.code).json({ message: resp.message });
            return; 
        }
        res.status(200).json(resp.dataUser as any);
    },
};
