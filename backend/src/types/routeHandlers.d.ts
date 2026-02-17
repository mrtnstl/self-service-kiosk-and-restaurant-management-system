import { RequestHandler } from "express";
import { UUID } from "node:crypto";
import * as express from "express";
import { AccessTokenPayload } from "./token.ts";

type CreateNonManagerUserBodyType = {
    name: string;
    password: string;
    roleId: number;
    restaurantId: string;
};

type UserPayload = {
    companyId: string;
    roleId: number;
};

declare global {
    namespace Express {
        interface Request {
            user: AccessTokenPayload;
        }
    }
}
