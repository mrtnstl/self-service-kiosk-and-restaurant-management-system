import { Pool } from "pg";

export interface CompanyRepo {
    pool: Pool;
}
export class CompanyRepo {
    private static instance: CompanyRepo;
    constructor(pool: Pool) {
        if (CompanyRepo.instance) {
            return CompanyRepo.instance;
        }
        this.pool = pool;
        CompanyRepo.instance = this;
    }
    // company profile
    async insertNewCompany({
        name, logoUrl
    }:{
        name: string, logoUrl: string
    }) {
        const result = await this.pool.query(
            "INSERT INTO companies (name, logo) VALUES ($1, $2) RETURNING id as company_id;",
            [name, logoUrl]
        );
        return result;
    }
    async getCompanyByName(name: string) {
        const result = await this.pool.query(
            "SELECT id, name FROM companies WHERE name = $1;",
            [name]
        );
        return result;
    }
}

export default CompanyRepo;
