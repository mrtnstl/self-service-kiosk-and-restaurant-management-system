import { ObjectRepo } from "../utils/DI.js";

export interface CompanyRepoIntrf {}
export class CompanyRepo implements CompanyRepoIntrf{
    private static instance: CompanyRepo;
    constructor() {
        if (CompanyRepo.instance) {
            return CompanyRepo.instance;
        }
        CompanyRepo.instance = this;
    }
    // company profile
    async insertNewCompany(objectRepo: ObjectRepo, {
        name,
        logoUrl,
    }: {
        name: string;
        logoUrl: string;
    }) {
        const result = await objectRepo.pool.query(
            "INSERT INTO companies (name, logo) VALUES ($1, $2) RETURNING id as company_id;",
            [name, logoUrl]
        );
        return result;
    }
    async getCompanyByName(objectRepo: ObjectRepo, name: string) {
        const result = await objectRepo.pool.query(
            "SELECT id, name FROM companies WHERE name = $1;",
            [name]
        );
        return result;
    }
}

export default CompanyRepo;
