import { RequestHandler } from "express";
import { ObjectRepo } from "../utils/DI.js";

interface AuthController {
    objectRepo: ObjectRepo;
}
class AuthController {
    private static instance: AuthController;
    constructor(objectRepo: ObjectRepo) {
        if (AuthController.instance) {
            return AuthController.instance;
        }

        this.objectRepo = objectRepo;

        AuthController.instance = this;
    }
    // register new manager user,
    register(): RequestHandler {
        const { services } = this.objectRepo;
        return async (req, res) => {

            // TODO: validate/sanitize input
            //      call user service
            // respond
            const {email, name, companyId} = req.body || {};
            if(typeof email === "undefined" || typeof name === "undefined" || typeof companyId === "undefined"){
                return res.status(401).json({message: "bad request. missing arguments."});
            }

            try {
                const result = await services.AuthService.registerNewCompanyManager(email, name, companyId);
                console.log(result);
                return res.status(200).json({ message: "new manager registered successfully." });
            } catch(err: any){
                return res.status(400).json({message: err.message});
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
            // TODO: validate/sanitize input
            //      call user service logoutUser
            // respond
            return res.status(200).json({ message: "hello from logout" });
        };
    }
}

export default AuthController;
