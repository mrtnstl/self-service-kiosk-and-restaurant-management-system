import { RequestHandler } from "express";
import { CreateNonManagerUserBodyType } from "../types/routeHandlers.js";
import { AuthSchemasInterf } from "../schemas/auth.schema.js";
import AuthService from "../services/auth.service.js";
import { BadRequestError, ValidationError } from "../errors/index.js";
import z from "zod";
import config from "../config/index.js";

interface AuthControllerInterf {}
class AuthController implements AuthControllerInterf {
    private static instance: AuthController;
    authSchemas!: AuthSchemasInterf;
    authService!: AuthService;

    constructor(authSchemas: AuthSchemasInterf, authService: AuthService) {
        if (AuthController.instance) {
            return AuthController.instance;
        }
        this.authSchemas = authSchemas;
        this.authService = authService;
        AuthController.instance = this;
    }

    // register new manager user,
    register(): RequestHandler {
        return async (req, res, next) => {
            const { email, name, password, companyId } = req.body || {};
            if (
                typeof email === "undefined" ||
                typeof name === "undefined" ||
                typeof password === "undefined" ||
                typeof companyId === "undefined"
            ) {
                throw new BadRequestError("Missing arguments");
            }

            const { data, error } =
                this.authSchemas.managerUserSchema.safeParse(req.body);
            if (error) {
                throw new ValidationError(z.flattenError(error).fieldErrors);
            }

            try {
                const result =
                    await this.authService.registerNewCompanyManager(data);

                return res
                    .status(200)
                    .json({ message: "new manager registered successfully." });
            } catch (err: any) {
                return next(err);
            }
        };
    }
    login(): RequestHandler {
        //const {} = this.objectRepo;
        return async (_req, res) => {
            // TODO: validate/sanitize input
            //      call user service loginUser
            // respond
            return res.status(200).json({ message: "hello from login" });
        };
    }
    logout(): RequestHandler {
        //const {} = this.objectRepo;
        return async (_req, res) => {
            // TODO:
            //      call user service logoutUser
            // respond
            return res.status(200).json({ message: "hello from logout" });
        };
    }
    loginAppliance(): RequestHandler {
        return async (req, res, next) => {
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
                    sameSite:
                        config.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: config.ACCESS_TOKEN_EXP_MS,
                });
                res.cookie("applianceUser", applianceUser, {
                    httpOnly: false,
                    secure: config.NODE_ENV === "production",
                    sameSite:
                        config.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: config.ACCESS_TOKEN_EXP_MS,
                });
                
                return res
                    .status(200)
                    .json({ message: "authenticated successfully" });
            } catch (err) {
                return next(err);
            }
        };
    }
    logoutAppliance(): RequestHandler {
        return async (req, res, next) => {
            // pass further to service - clear cookies
            return "ok";
        };
    }
    registerNonManagerUser(): RequestHandler<
        unknown,
        unknown,
        CreateNonManagerUserBodyType,
        unknown
    > {
        return async (req, res, next) => {
            const { name, password, roleId, restaurantId } = req.body || {};
            if (
                typeof name === "undefined" ||
                typeof password === "undefined" ||
                typeof roleId === "undefined" ||
                typeof restaurantId === "undefined"
            ) {
                throw new BadRequestError("Missing arguments");
            }

            const { data, error } =
                this.authSchemas.nonManagerUserSchema.safeParse({
                    ...req.body,
                    companyId: req.user.companyId,
                });
            if (error) {
                throw new ValidationError(z.flattenError(error).fieldErrors);
            }

            try {
                const result = await this.authService.registerNewNonManagerUser(
                    data!
                );
                return res
                    .status(201)
                    .json({ message: "new user registered successfully." });
            } catch (err: any) {
                return next(err);
            }
        };
    }
    setUserToVerified(): RequestHandler {
        return async (req, res, next) => {
            const { token } = req.params;
            try {
                const verifying = await this.authService.setVerifiedUser(
                    token as string
                );
                return res
                    .status(202)
                    .json({ message: "user verified successfully." });
            } catch (err) {
                return next(err);
            }
        };
    }
    disableUserVerification(): RequestHandler {
        return async (req, res, next) => {
            const { userId } = req.body;
            try {
                const disabling = await this.authService.setVerifiedUserFalse(
                    userId as string
                );
                return res.status(202).json({
                    message: "user verification disabled successfully.",
                });
            } catch (err) {
                return next(err);
            }
        };
    }
}

export default AuthController;
