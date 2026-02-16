import { RequestHandler } from "express";
import { NotFoundError } from "../errors/index.js";

export default (): RequestHandler => {
    return async (_req, res, _next) => {
        const notFoundError = new NotFoundError();
        return res
            .status(notFoundError.statusCode)
            .json({ message: notFoundError.message });
    };
};
