import { Router } from "express";
import objectRepo from "../utils/DI.js";

import CompanyController from "../controllers/company.controller.js";

const companyContrlr = new CompanyController(objectRepo);

const companyRouter = Router();

companyRouter.post("/register", companyContrlr.register());

export default companyRouter;
