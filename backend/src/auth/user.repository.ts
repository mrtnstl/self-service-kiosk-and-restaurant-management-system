import { UUID } from "node:crypto";
import { Pool } from "pg";

export interface UserRepo {
    pool: Pool;
}
export class UserRepo {
    private static instance: UserRepo;
    constructor(pool: Pool) {
        if (UserRepo.instance) {
            return UserRepo.instance;
        }
        this.pool = pool;
        UserRepo.instance = this;
    }
    // create manager account, fixed manager role (after company profile creation)
    async insertNewManagerUser({
        name, email, companyId, pwHash, pwSalt
    }:{
        name: string, email: string, companyId: UUID, pwHash: string, pwSalt: string
    }) {
        const result = await this.pool.query(
            "INSERT INTO users (name, email, company_id, role_id, pw_hash, pw_salt) VALUES ($1, $2, $3, $4, $5, $6);",
            [name, email, companyId, 1, pwHash, pwSalt]
        );
        return result;
    }
    async getUserByEmail(email: string) {
        const result = await this.pool.query(
            "SELECT id, name, email FROM users WHERE email = $1;",
            [email]
        );
        return result;
    }
    // company managers can create interanl users, non-manager roles
    async insertNewInternalUser() {
        const result = await this.pool.query("", []);
        return result;
    }
}

export default UserRepo;
