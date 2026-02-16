import { Router } from "express";
import { createAuthController } from "../controllers/auth.controller.factory.js";

const authContrlr = createAuthController();

const authRouter = Router();

authRouter.post("/register", authContrlr.register());
authRouter.post("/login", authContrlr.login());
authRouter.post("/logout", /* authMW */ authContrlr.logout());
authRouter.post(
    "/create-non-manager",
    /* authMW, autorizMW*/ authContrlr.registerNonManagerUser()
);
authRouter.get("/verify/:token", authContrlr.setUserToVerified());
authRouter.put("/disable", authContrlr.disableUserVerification());
// TODO: forgot pw, set new pw

export default authRouter;
