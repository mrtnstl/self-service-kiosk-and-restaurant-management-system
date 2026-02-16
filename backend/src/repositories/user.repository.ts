import { Pool, QueryResult } from "pg";

export class UserRepo {
    private static instance: UserRepo;
    pool!: Pool;
    constructor(pool: Pool) {
        if (UserRepo.instance) {
            return UserRepo.instance;
        }
        this.pool = pool;
        UserRepo.instance = this;
    }
    // create manager account, fixed manager role (after company profile creation)
    async insertNewManagerUser({
        name,
        email,
        companyId,
        pwHash,
        pwSalt,
        userSecretToken
    }: {
        name: string;
        email: string;
        companyId: string;
        pwHash: string;
        pwSalt: string;
        userSecretToken: string;
    }): Promise<QueryResult<{ name: string; email: string, usersecrettoken: string }>> {
        const result = await this.pool.query(
            "INSERT INTO users (name, email, company_id, role_id, is_verified, user_secret_token, pw_hash, pw_salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING name, email, user_secret_token AS usersecrettoken;",
            [name, email, companyId, 1, false, userSecretToken, pwHash, pwSalt]
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
    async getUserByName(name: string) {
        const result = await this.pool.query(
            "SELECT id, name, email FROM users WHERE name = $1;",
            [name]
        );
        return result;
    }
    // company managers can create interanl users, non-manager roles
    async insertNewInternalUser({
        name,
        roleId,
        restaurantId,
        companyId,
        pwHash,
        pwSalt,
    }: {
        name: string;
        roleId: number;
        restaurantId: string;
        companyId: string;
        pwHash: string;
        pwSalt: string;
    }) {
        const result = await this.pool.query(
            "INSERT INTO users (name, company_id, restaurant_id, role_id, pw_hash, pw_salt) VALUES ($1, $2, $3, $4, $5, $6);",
            [name, companyId, restaurantId, roleId, pwHash, pwSalt]
        );
        return result;
    }
}

export default UserRepo;
