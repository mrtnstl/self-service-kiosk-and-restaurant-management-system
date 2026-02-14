import { RequestHandler } from "express";

export default (): RequestHandler => {
    return async (_req, res, _next) => {
        return res.status(404).json({ message: "resource not found." });
    };
};
