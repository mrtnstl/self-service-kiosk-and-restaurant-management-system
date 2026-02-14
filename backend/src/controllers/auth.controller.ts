import { RequestHandler } from "express";
import { ObjectRepo } from "../utils/DI.js";
import { CreateNonManagerUserBodyType } from "../types/routeHandlers.js";

interface AuthControllerInterf {
    objectRepo: ObjectRepo;
}
class AuthController implements AuthControllerInterf {
    private static instance: AuthController;
    objectRepo!: ObjectRepo;
    constructor(objectRepo: ObjectRepo) {
        if (AuthController.instance) {
            return AuthController.instance;
        }

        this.objectRepo = objectRepo;

        AuthController.instance = this;
    }
    // register new manager user,
    register(): RequestHandler {
        const { services, schemas } = this.objectRepo;
        return async (req, res) => {
            const { email, name, password, companyId } = req.body || {};
            if (
                typeof email === "undefined" ||
                typeof name === "undefined" ||
                typeof password === "undefined" ||
                typeof companyId === "undefined"
            ) {
                return res
                    .status(401)
                    .json({ message: "bad request. missing arguments." });
            }

            const { data, error } = schemas.authSchemas.managerUserSchema.safeParse(req.body);
            if (error) {
                console.log(error);
                return res
                    .status(401)
                    .json({ message: "bad request. invalid arguments." });
            }

            try {
                const result =
                    await services.AuthService.registerNewCompanyManager(this.objectRepo, data);
                console.log(result);
                return res
                    .status(200)
                    .json({ message: "new manager registered successfully." });
            } catch (err: any) {
                return res.status(400).json({ message: err.message });
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
    registerNonManagerUser(): RequestHandler<
        unknown,
        unknown,
        CreateNonManagerUserBodyType,
        unknown
    > {
        const { services, schemas } = this.objectRepo;
        return async (req, res) => {
            const { name, password, roleId, restaurantId } = req.body || {};
            if (
                typeof name === "undefined" ||
                typeof password === "undefined" ||
                typeof roleId === "undefined" ||
                typeof restaurantId === "undefined"
            ) {
                return res
                    .status(401)
                    .json({ message: "bad request." });
            }

            const { data, error } = schemas.authSchemas.nonManagerUserSchema.safeParse({
                ...req.body,
                companyId: req.user.companyId,
            });
            if (error) {
                console.log(error);
                return res
                    .status(401)
                    .json({ message: "bad request. invalid arguments." });
            }

            try {
                const result =
                    await services.AuthService.registerNewNonManagerUser(this.objectRepo, data!);
                console.log(result);
                return res
                    .status(201)
                    .json({ message: "new user registered successfully." });
            } catch (err: any) {
                return res.status(400).json({ message: err.message });
            }
        };
    }
}

export default AuthController;
