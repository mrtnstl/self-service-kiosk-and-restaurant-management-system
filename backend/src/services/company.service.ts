import { ObjectRepo } from "../utils/DI.js";

export interface CompanyServiceIntrf {}

export class CompanyService implements CompanyServiceIntrf{
    private static instance: CompanyService;
    constructor() {
        if (CompanyService.instance) {
            return CompanyService.instance;
        }
        CompanyService.instance = this;
    }
    async registerNewCompany(objectRepo: ObjectRepo, data: {name: string, logoUrl: string}) {
        const {repos} = objectRepo;
        try {
            const existingCompany =
                await repos.CompanyRepo.getCompanyByName(objectRepo, data.name);
            if (existingCompany.rows.length > 0) {
                throw new Error("company already exists.");
            }
            
            const result = await repos.CompanyRepo.insertNewCompany(objectRepo, data);
            return result.rows[0]["company_id"];
        } catch (err) {
            throw err;
        }
    }
}

export default CompanyService;
