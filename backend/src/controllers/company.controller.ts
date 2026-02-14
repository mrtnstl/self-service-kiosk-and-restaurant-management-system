import { RequestHandler } from "express";
import { ObjectRepo } from "../utils/DI.js";

interface CompanyControllerIntrf {
    objectRepo: ObjectRepo;
}
class CompanyController implements CompanyControllerIntrf{
    private static instance: CompanyController;
    objectRepo!: ObjectRepo;

    constructor(objectRepo: ObjectRepo) {
        if (CompanyController.instance) {
            return CompanyController.instance;
        }
        this.objectRepo = objectRepo;
        CompanyController.instance = this;
    }
    // register a new company, manager users only
    register(): RequestHandler {
        const { services, schemas } = this.objectRepo;
        return async (req, res) => {
            const { name, logoUrl } = req.body || {};
            if (typeof name === "undefined") {
                return res.status(400).json({
                    message:
                        "failed to register company. name can not be undefined.",
                });
            }
            // TODO: validate/sanitize input
            const { data, error } = schemas.companySchemas.newCompanySchema.safeParse(req.body);
            if (error) {
                console.log(error);
                return res
                    .status(401)
                    .json({ message: "bad request. invalid arguments." });
            }

            try {
                const newCompanyId =
                    await services.CompanyService.registerNewCompany(this.objectRepo, data);
                return res
                    .status(201)
                    .json({ message: "success", newCompanyId });
            } catch (err: any) {
                console.log("ERROR:", err);
                return res.status(400).json({ message: err.message });
            }
        };
    }
}

export default CompanyController;
