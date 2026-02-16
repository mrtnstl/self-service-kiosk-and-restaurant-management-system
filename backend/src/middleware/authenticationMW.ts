import { RequestHandler } from "express";
import { UnauthorizedError } from "../errors/index.js";
import { decodeAccessToken } from "../helpers/auth.helpers.js";

export default (): RequestHandler => {
    return async (req, res, next) => {
        const { accessToken } = req.cookies;
        if (!accessToken)
            throw new UnauthorizedError("Authentication required");

        const { error, payload } = await decodeAccessToken(accessToken);
        if (error) {
            throw new UnauthorizedError(
                "Authentication required. Invalid token"
            );
        }

        req.user = payload;

        // TEMP!!!
        console.log(payload);

        return next();
    };
};
