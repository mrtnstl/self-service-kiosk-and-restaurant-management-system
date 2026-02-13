import { RequestHandler } from "express";
import { ObjectRepo } from "../utils/DI.js";

interface CompanyController {
    objectRepo: ObjectRepo;
}
class CompanyController {
    private static instance: CompanyController;
    constructor(objectRepo: ObjectRepo) {
        if (CompanyController.instance) {
            return CompanyController.instance;
        }
        this.objectRepo = objectRepo;
        CompanyController.instance = this;
    }
    // register a new company, manager users only
    register(): RequestHandler {
        const { services } = this.objectRepo;
        return async (req, res) => {
            const {name, logoUrl} = req.body || {};
            if(typeof name === "undefined"){
                return res.status(400).json({message: "failed to register company. name can not be undefined."});
            }
            // TODO: validate/sanitize input
            
            try{
                const newCompanyId = await services.CompanyService.registerNewCompany(name, logoUrl);
                return res.status(201).json({ message: "success", newCompanyId });
            } catch(err: any){
                console.log("ERROR:", err)
                return res.status(400).json({message: err.message});
            }
        };
    }
}

export default CompanyController;
