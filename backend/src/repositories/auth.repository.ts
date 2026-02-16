import { Pool, QueryResult } from "pg";

export class AuthRepo {
    private static instance: AuthRepo;
    pool!: Pool;
    constructor(pool: Pool) {
        if (AuthRepo.instance) {
            return AuthRepo.instance;
        }
        this.pool = pool;
        AuthRepo.instance = this;
    }
    async updateUserIsVerifiedToTrue(userSecret: string) {
        const result = await this.pool.query(
            "UPDATE users SET is_verified = true WHERE user_secret_token = $1;",
            [userSecret]
        );
        return result;
    }
    async updateUserIsVerifiedToFalse(userId: string){
        const result = await this.pool.query("UPDATE users SET is_verified = false WHERE id = $1;",[userId]);
        return result;
    }
}

export default AuthRepo;
