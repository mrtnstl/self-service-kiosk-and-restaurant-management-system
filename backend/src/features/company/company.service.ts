import CompanyRepo from "./company.repository.js";

export class CompanyService {
    private static instance: CompanyService;
    companyRepo!: CompanyRepo;
    constructor(companyRepo: CompanyRepo) {
        if (CompanyService.instance) {
            return CompanyService.instance;
        }
        this.companyRepo = companyRepo;
        CompanyService.instance = this;
    }
    async registerNewCompany(data: { name: string; logoUrl: string }) {
        try {
            const existingCompany = await this.companyRepo.getCompanyByName(
                data.name
            );
            if (existingCompany.rows.length > 0) {
                throw new Error("company already exists.");
            }

            const result = await this.companyRepo.insertNewCompany(data);
            return result.rows[0]["company_id"];
        } catch (err) {
            throw err;
        }
    }
}

export default CompanyService;
