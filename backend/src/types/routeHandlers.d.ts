import { RequestHandler } from "express";
import { UUID } from "node:crypto";
import * as express from "express";

type CreateNonManagerUserBodyType = {
    name: string;
    password: string;
    roleId: number;
    restaurantId: string;
};

type UserPayload = {
    companyId: string;
};

declare global {
    namespace Express {
        interface Request {
            user: UserPayload;
        }
    }
}
