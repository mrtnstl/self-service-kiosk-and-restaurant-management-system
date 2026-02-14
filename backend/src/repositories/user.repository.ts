import { ObjectRepo } from "../utils/DI.js";

export interface UserRepoIntrf {}
export class UserRepo implements UserRepoIntrf {
    private static instance: UserRepo;
    constructor() {
        if (UserRepo.instance) {
            return UserRepo.instance;
        }
        UserRepo.instance = this;
    }
    // create manager account, fixed manager role (after company profile creation)
    async insertNewManagerUser(objectRepo: ObjectRepo, {
        name,
        email,
        companyId,
        pwHash,
        pwSalt,
    }: {
        name: string;
        email: string;
        companyId: string;
        pwHash: string;
        pwSalt: string;
    }) {
        const result = await objectRepo.pool.query(
            "INSERT INTO users (name, email, company_id, role_id, pw_hash, pw_salt) VALUES ($1, $2, $3, $4, $5, $6);",
            [name, email, companyId, 1, pwHash, pwSalt]
        );
        return result;
    }
    async getUserByEmail(objectRepo: ObjectRepo, email: string) {
        const result = await objectRepo.pool.query(
            "SELECT id, name, email FROM users WHERE email = $1;",
            [email]
        );
        return result;
    }
    async getUserByName(objectRepo: ObjectRepo, name: string) {
        const result = await objectRepo.pool.query(
            "SELECT id, name, email FROM users WHERE name = $1;",
            [name]
        );
        return result;
    }
    // company managers can create interanl users, non-manager roles
    async insertNewInternalUser(objectRepo: ObjectRepo, {
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
        const result = await objectRepo.pool.query(
            "INSERT INTO users (name, company_id, restaurant_id, role_id, pw_hash, pw_salt) VALUES ($1, $2, $3, $4, $5, $6);",
            [name, companyId, restaurantId, roleId, pwHash, pwSalt]
        );
        return result;
    }
}

export default UserRepo;
