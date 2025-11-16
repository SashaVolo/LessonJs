import type { NextFunction, Request, Response } from "express";
import { AuthenticatedUser } from "../User/user.types";
import { verify } from "jsonwebtoken";

import { ENV } from "../config/env";

export function authMiddleware(
    req: Request,
    res: Response<object, { userId: number }>,
    next: NextFunction
) {
    // Получаем значение заголовка Authorization
    const authorization = req.headers.authorization;

    // Если заголовка нет
    if (!authorization) {
        res.status(401).json({
            message: "authorization is required",
        });
        return;
    }

    // Разделение на тип и сам токен
    const [typeToken, token] = authorization.split(" ");

    // Проверяем формат и наличие токена
    if (typeToken !== "Bearer" || !token) {
        res.status(401).json({
            message: "invalid authorization. Use Bearer token",
        });
        return;
    }

    try {
        //декодируем
        const decodedToken = verify(token, ENV.SECRET_KEY) as AuthenticatedUser;

        // Сохраняем id пользователя в res.locals 
        res.locals.userId = decodedToken.id;

        next();

    } catch (error) {
        console.log(error);

        res.status(401).json({
            message: "invalid token",
        });
    }
}
