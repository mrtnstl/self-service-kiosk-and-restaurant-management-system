import { Router } from "express";
import { createMenuController } from "./menu.controller.factory.js";
import authenticationMW from "../../common/middleware/authenticationMW.js";

const menuContrlr = createMenuController();

const menuRouter = Router();

menuRouter.get("/", authenticationMW(), menuContrlr.getAllDishOfCompany());

export default menuRouter;
