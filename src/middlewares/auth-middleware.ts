import type { NextFunction, Request, Response } from "express";
import { AuthenticatedUser } from "../User/user.types";
import { verify } from "jsonwebtoken";

import { ENV } from "../config/env";

export function authMiddleware(
    req: Request,
    res: Response<object, { userId: number }>,
    next: NextFunction
) {

    const authorization = req.headers.authorization;

    if (!authorization) {
        res.status(401).json({
            message: "authorization is required",
        });
        return;
    }


    const [typeToken, token] = authorization.split(" ");


    if (typeToken !== "Bearer" || !token) {
        res.status(401).json({
            message: "invalid authorization. Use Bearer token",
        });
        return;
    }

    try {

        const decodedToken = verify(token, ENV.SECRET_KEY) as AuthenticatedUser;

        res.locals.userId = decodedToken.id;

        next();

    } catch (error) {
        console.log(error);

        res.status(401).json({
            message: "invalid token",
        });
    }
}

export function authMiddlewareOptional(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return next();
    }

    const [typeToken, token] = authorization.split(" ");

    if (typeToken !== "Bearer" || !token) {
        return next();
    }

    try {
        const decodedToken = verify(token, ENV.SECRET_KEY) as AuthenticatedUser;

        res.locals.userId = decodedToken.id;

    } catch (error) {

        console.log("Optional auth token check failed:", error);
    }

    next();
}
