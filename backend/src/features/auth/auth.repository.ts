import { Pool, QueryResult } from "pg";
import {
    NotFoundError,
    ConflictError,
    InternalServerError,
} from "../../common/errors/index.js";

export interface IAuthRepository {
    setUserVerifiedToTrue(userSecret: string): Promise<QueryResult>;
    setUserVerifiedToFlase(userID: string): Promise<QueryResult>;
}

export class AuthRepository implements IAuthRepository {
    constructor(private readonly pool: Pool) {}

    async setUserVerifiedToTrue(userSecret: string): Promise<QueryResult> {
        try {
            const result = await this.pool.query(
                `UPDATE users SET is_verified = true, user_secret_token = NULL 
                WHERE user_secret_token = $1;`,
                [userSecret]
            );
            return result;
        } catch (err) {
            throw new InternalServerError();
        }
    }

    async setUserVerifiedToFlase(userID: string): Promise<QueryResult> {
        try {
            const result = await this.pool.query(
                `UPDATE users SET is_verified = false 
                WHERE id = $1;`,
                [userID]
            );
            return result;
        } catch (err) {
            throw new InternalServerError();
        }
    }
}
