import CompanyController from "./company.controller.js";
import companySchemas from "../schemas/company.schema.js";
import CompanyService from "../services/company.service.js";
import CompanyRepo from "../repositories/company.repository.js";
import pool from "../utils/database.js";

export function createCompanyController() {
    const companyRepo = new CompanyRepo(pool);
    const companyService = new CompanyService(companyRepo);
    return new CompanyController(companySchemas, companyService);
}
