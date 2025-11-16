
import { Router } from "express";
import {userController} from "./user.controller";
import { authMiddleware } from "../middlewares/auth-middleware";

const userRouter = Router();

// Вся информация о пользователе
userRouter.get("/me", authMiddleware, userController.me);

// Войти 
userRouter.post("/login", userController.login);
// Регистрация
userRouter.post("/register", userController.register);



export {userRouter}


