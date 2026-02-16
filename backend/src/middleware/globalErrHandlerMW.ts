import { ErrorRequestHandler } from "express";
import { AppError, BadRequestError } from "../errors/index.js";
import logger from "../utils/logger.js";

type ErrorMessage = {
    status: string;
    message: string;
    statusCode: number;
    details?: Record<string, any>;
};

export default (): ErrorRequestHandler => {
    return async (err, req, res, _next) => {
        if (err instanceof AppError) {
            const response: ErrorMessage = {
                status: "error",
                message: err.message,
                statusCode: err.statusCode,
            };

            if (err instanceof BadRequestError && err.details) {
                response.details = err.details;
            }

            if (!err.isOp) {
                logger.error({}, err.message);
            } else {
                logger.error(
                    {
                        path: req.path,
                    },
                    err.message
                );
            }

            return res.status(err.statusCode).json(response);
        }

        logger.error(
            {
                message: err.message,
                stack: err.stack,
                path: req.path,
                method: req.method,
            },
            "Unexpected Error"
        );

        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    };
};
