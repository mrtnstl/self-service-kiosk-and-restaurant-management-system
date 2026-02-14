import CompanyRepo from "../repositories/company.repository.js";

export interface CompanyService {
    CompanyRepo: CompanyRepo;
}

export class CompanyService {
    private static instance: CompanyService;
    constructor(CompanyRepo: CompanyRepo) {
        if (CompanyService.instance) {
            return CompanyService.instance;
        }
        this.CompanyRepo = CompanyRepo;
        CompanyService.instance = this;
    }
    async registerNewCompany(name: string, logoUrl: string) {
        try {
            const existingCompany =
                await this.CompanyRepo.getCompanyByName(name);
            if (existingCompany.rows.length > 0) {
                throw new Error("company already exists.");
            }

            const company = { name: name, logoUrl: logoUrl };
            const result = await this.CompanyRepo.insertNewCompany(company);
            return result.rows[0]["company_id"];
        } catch (err) {
            throw err;
        }
    }
}

export default CompanyService;
