import { Router } from "express";
import { createCompanyController } from "./company.controller.factory.js";

const companyContrlr = createCompanyController();

const companyRouter = Router();

companyRouter.post("/register", companyContrlr.register());

export default companyRouter;
