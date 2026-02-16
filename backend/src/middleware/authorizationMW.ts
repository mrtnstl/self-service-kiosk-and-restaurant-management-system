import { RequestHandler } from "express";
import { UnauthorizedError } from "../errors/index.js";

export default (allowedRoles: Array<number>): RequestHandler => {
    return async (req, _res, next) => {
        const userRoleId = req.user.roleId;

        const isAllowed = allowedRoles.includes(userRoleId);
        if (!isAllowed) {
            throw new UnauthorizedError("Insufficient rights");
        }

        return next();
    };
};
