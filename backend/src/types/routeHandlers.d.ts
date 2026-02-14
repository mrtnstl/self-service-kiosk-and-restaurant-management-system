import { RequestHandler } from "express";
import { UUID } from "node:crypto";
import * as express from "express";

type CreateNonManagerUserBody = {
    name: string;
    password: string;
    role: string;
    restaurantId: UUID;
};

type UserPayload = {
    companyId: UUID;
};

declare global {
    namespace Express {
        interface Request {
            user: UserPayload;
        }
    }
}
