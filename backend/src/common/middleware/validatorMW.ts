import { RequestHandler } from "express";
import z, { ZodObject, ZodError } from "zod";
import { ValidationError } from "../errors/index.js";

interface ValidationSchemas {
    body?: z.ZodObject;
    query?: z.ZodObject;
    params?: z.ZodObject;
}

export default async (schemas: ValidationSchemas): Promise<RequestHandler> => {
    return async (req, _res, next) => {
        try {
            if (schemas.body) {
                req.body = await schemas.body.parseAsync(req.body);
            }
            /*if (schemas.query) {
                req.query = await schemas.query.parseAsync(req.query);
            }
            if (schemas.params) {
                req.params = await schemas.params.parseAsync(req.params);
            }*/
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const issues = err.issues.map(issue => ({
                    path: issue.path.join("."),
                    message: issue.message,
                    code: issue.code,
                }));

                throw new ValidationError({
                    statusCode: 400,
                    details: issues,
                });
            }
            next(err);
        }
    };
};
