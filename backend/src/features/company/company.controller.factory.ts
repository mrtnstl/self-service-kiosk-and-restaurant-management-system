import CompanyController from "./company.controller.js";
import companySchemas from "./schemas/company.schema.js";
import CompanyService from "./company.service.js";
import CompanyRepo from "./company.repository.js";
import pool from "../../infrastructure/db/postgres.js";

export function createCompanyController() {
    const companyRepo = new CompanyRepo(pool);
    const companyService = new CompanyService(companyRepo);
    return new CompanyController(companySchemas, companyService);
}
