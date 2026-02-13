import { Pool } from "pg";
import pool from "./database.js";

// constructing repos
import UserRepo from "../auth/user.repository.js";
import CompanyRepo from "../company/company.repository.js";

interface Repos {
    UserRepo: UserRepo;
    CompanyRepo: CompanyRepo;
}
const repos: Repos = {
    UserRepo: new UserRepo(pool),
    CompanyRepo: new CompanyRepo(pool),
};

// inject repos into services
import AuthService from "../auth/auth.service.js";
import CompanyService from "../company/company.service.js";

interface Services {
    AuthService: AuthService;
    CompanyService: CompanyService
}
const services: Services = {
    AuthService: new AuthService(repos.UserRepo),
    CompanyService: new CompanyService(repos.CompanyRepo),
};

// assembling ObjectRepo
export interface ObjectRepo {
    pool: object;
    services: Services;
}

export class ObjectRepo {
    static instance: ObjectRepo;
    constructor(pool: Pool, services: Services) {
        if (ObjectRepo.instance) {
            return ObjectRepo.instance;
        }

        this.pool = pool;
        this.services = services;

        ObjectRepo.instance = this;
    }
}
const objectRepo = new ObjectRepo(pool, services);
export default objectRepo;
