import { Router } from "express";
import objectRepo from "../utils/DI.js";

import AuthController from "../controllers/auth.controller.js";

const authContrlr = new AuthController(objectRepo);

const authRouter = Router();

authRouter.post("/register", authContrlr.register());
authRouter.post("/login", authContrlr.login());
authRouter.post("/logout", /* authMW */ authContrlr.logout());
authRouter.post(
    "/create-non-manager",
    /* authMW, autorizMW*/ authContrlr.registerNonManagerUser()
);
// TODO: forgot pw, set new pw

export default authRouter;
