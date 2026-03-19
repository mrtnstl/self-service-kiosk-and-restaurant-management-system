import { Request, Response, NextFunction, RequestHandler } from "express";
import z from "zod";

import config from "../../config/index.js";
import { IAuthService } from "./auth.service.js";
import {
    BadRequestError,
    InternalServerError,
    ValidationError,
} from "../../common/errors/index.js";

import { CreateNonManagerUserBodyType } from "../../types/routeHandlers.js";
import { AuthSchemasInterf } from "./schemas/auth.schema.js";

export interface IAuthController {
    register(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    login(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    logout(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    loginAppliance(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    logoutAppliance(
        _req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    registerApplianceUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    setUserToVerified(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
    disableUserVerification(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void>;
}

export class AuthController implements IAuthController {
    constructor(
        private authSchemas: AuthSchemasInterf,
        private authService: IAuthService
    ) {}
    // register new manager user,
    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { email, name, password, companyId } = req.body || {};
        if (
            typeof email === "undefined" ||
            typeof name === "undefined" ||
            typeof password === "undefined" ||
            typeof companyId === "undefined"
        ) {
            throw new BadRequestError("Missing arguments");
        }

        const { data, error } = this.authSchemas.managerUserSchema.safeParse(
            req.body
        );
        if (error) {
            throw new ValidationError(z.flattenError(error).fieldErrors);
        }

        try {
            await this.authService.registerNewCompanyManager(data);

            return res
                .status(200)
                .json({ message: "new manager registered successfully." });
        } catch (err: any) {
            return next(err);
        }
    };
    login = async (
        _req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        return next(new InternalServerError("NOT IMPLEMENTED!"));
    };
    logout = async (
        _req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        return next(new InternalServerError("NOT IMPLEMENTED!"));
    };
    loginAppliance = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { data, error } =
            this.authSchemas.applianceLoginInputSchema.safeParse(req.body);
        if (error) {
            throw new ValidationError(z.flattenError(error).fieldErrors);
        }
        try {
            const { applianceUser, accessToken } =
                await this.authService.authenticateAppliance(data);

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                maxAge: config.ACCESS_TOKEN_EXP_MS,
            });
            res.cookie("applianceUser", applianceUser, {
                httpOnly: false,
                secure: config.NODE_ENV === "production",
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                maxAge: config.ACCESS_TOKEN_EXP_MS,
            });

            return res
                .status(200)
                .json({ message: "authenticated successfully" });
        } catch (err) {
            return next(err);
        }
    };
    logoutAppliance = async (
        _req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        return next(new InternalServerError("NOT IMPLEMENTED!"));
    };
    registerApplianceUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { name, password, roleId, restaurantId } = req.body || {};
        if (
            typeof name === "undefined" ||
            typeof password === "undefined" ||
            typeof roleId === "undefined" ||
            typeof restaurantId === "undefined"
        ) {
            throw new BadRequestError("Missing arguments");
        }

        const { data, error } = this.authSchemas.nonManagerUserSchema.safeParse(
            {
                ...req.body,
                companyId: req.user.companyId,
            }
        );
        if (error) {
            throw new ValidationError(z.flattenError(error).fieldErrors);
        }

        try {
            await this.authService.registerNewApplianceUser(data!);
            return res
                .status(201)
                .json({ message: "new user registered successfully." });
        } catch (err: any) {
            return next(err);
        }
    };
    setUserToVerified = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { token } = req.params;
        try {
            await this.authService.setVerifiedUser(token as string);
            return res
                .status(202)
                .json({ message: "user verified successfully." });
        } catch (err) {
            return next(err);
        }
    };
    disableUserVerification = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const { userId } = req.body;
        try {
            await this.authService.setVerifiedUserFalse(userId as string);
            return res.status(202).json({
                message: "user disabled successfully.",
            });
        } catch (err) {
            return next(err);
        }
    };
}
