import { Router } from "express";
import { createAuthController } from "./auth.controller.factory.js";
import config from "../../config/index.js";

import authenticationMW from "../../common/middleware/authenticationMW.js";
import authorizationMW from "../../common/middleware/authorizationMW.js";
import validatorMW from "../../common/middleware/validatorMW.js";

const authContrlr = createAuthController();

const authRouter = Router();

authRouter.post("/register", authContrlr.register);
authRouter.post("/login", authContrlr.login);
authRouter.get("/logout", authenticationMW(), authContrlr.logout);
authRouter.post("/appliance/login", authContrlr.loginAppliance);
authRouter.get(
    "/appliance/logout",
    authenticationMW(),
    authContrlr.logoutAppliance
);
authRouter.post(
    "/appliance/register",
    authenticationMW(),
    authorizationMW([config.ROLES.MANAGER]),
    authContrlr.registerApplianceUser
);
authRouter.get("/verify/:token", authContrlr.setUserToVerified);
authRouter.put(
    "/disable",
    authenticationMW(),
    authorizationMW([config.ROLES.MANAGER]),
    authContrlr.disableUserVerification
);
// TODO: forgot pw, set new pw

export default authRouter;
