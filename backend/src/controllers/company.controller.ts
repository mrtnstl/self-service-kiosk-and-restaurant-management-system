import { RequestHandler } from "express";
import { CompanySchemasInterf } from "../schemas/company.schema.js";
import CompanyService from "../services/company.service.js";
import { BadRequestError, ValidationError } from "../errors/index.js";
import z from "zod";

export interface ICompanyController {
    readonly companySchemas: CompanySchemasInterf;
    readonly companyService: CompanyService;
    register: () => RequestHandler;
}

class CompanyController implements ICompanyController {
    private static instance: CompanyController;
    readonly companySchemas!: CompanySchemasInterf;
    readonly companyService!: CompanyService;

    constructor(
        companySchemas: CompanySchemasInterf,
        companyService: CompanyService
    ) {
        if (CompanyController.instance) {
            return CompanyController.instance;
        }
        this.companySchemas = companySchemas;
        this.companyService = companyService;
        CompanyController.instance = this;
    }

    // register a new company, manager users only
    register(): RequestHandler {
        return async (req, res, next) => {
            const { name, logoUrl } = req.body || {};
            if (typeof name === "undefined") {
                throw new BadRequestError("Missing arguments");
            }
            // TODO: validate/sanitize input
            const { data, error } =
                this.companySchemas.newCompanySchema.safeParse(req.body);
            if (error) {
                throw new ValidationError(z.flattenError(error).fieldErrors);
            }

            try {
                const newCompanyId =
                    await this.companyService.registerNewCompany(data);
                return res
                    .status(201)
                    .json({ message: "success", newCompanyId });
            } catch (err: any) {
                return next(err);
            }
        };
    }
}

export default CompanyController;
