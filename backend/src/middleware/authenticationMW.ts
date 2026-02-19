import { RequestHandler } from "express";
import { UnauthorizedError } from "../errors/index.js";
import { decodeAccessToken } from "../helpers/auth.helpers.js";
import { AccessTokenPayload } from "../types/token.js";

export default (): RequestHandler => {
    return async (req, res, next) => {
        const { accessToken, applianceUser, reguralUser } = req.cookies;
        if (!accessToken) {
            throw new UnauthorizedError("Authentication required");
        }

        try {
            const payload = (await decodeAccessToken(
                accessToken
            )) as AccessTokenPayload;
            req.user = payload;
            return next();
        } catch (err: any) {
            // TODO: if TokenExpiredError try get new access token with refresh token
            if (err.name !== "TokenExpiredError") {
                console.log("LEJÁRT ACCESS TOKEN:", err.name);
            }
            
            res.clearCookie("accessToken");
            applianceUser && res.clearCookie("applianceUser");
            reguralUser && res.clearCookie("reguralUser");
            
            return next(err);
        }
    };
};
