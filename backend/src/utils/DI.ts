import { Pool } from "pg";
import pool from "./database.js";
import config, { Config } from "../config/index.js";
import bcrypt from "bcrypt";

import UserRepo from "../repositories/user.repository.js";
import CompanyRepo from "../repositories/company.repository.js";
import RestaurantRepo from "../repositories/restaurant.repository.js";

import AuthService from "../services/auth.service.js";
import CompanyService from "../services/company.service.js";
import RestaurantService from "../services/restaurant.service.js";

import authSchemas, { AuthSchemasInterf } from "../schemas/auth.schema.js";
import companySchemas, {
    CompanySchemasInterf,
} from "../schemas/company.schema.js";
import restaurantSchemas, {
    RestaurantSchemasInterf,
} from "../schemas/restaurant.schema.js";

// repos
interface Repos {
    UserRepo: UserRepo;
    CompanyRepo: CompanyRepo;
    RestaurantRepo: RestaurantRepo;
}
const repos: Repos = {
    UserRepo: new UserRepo(),
    CompanyRepo: new CompanyRepo(),
    RestaurantRepo: new RestaurantRepo(),
};

// services
interface Services {
    AuthService: AuthService;
    CompanyService: CompanyService;
    RestaurantService: RestaurantService;
}
const services: Services = {
    AuthService: new AuthService(),
    CompanyService: new CompanyService(),
    RestaurantService: new RestaurantService(),
};
// schemas
interface Schemas {
    authSchemas: AuthSchemasInterf;
    companySchemas: CompanySchemasInterf;
    restaurantSchemas: RestaurantSchemasInterf;
}
const schemas: Schemas = {
    authSchemas: authSchemas,
    companySchemas: companySchemas,
    restaurantSchemas: restaurantSchemas,
};

// bcrypt
interface BcryptInterf {
    genSalt(rounds?: number, minor?: "a" | "b"): Promise<string>;
    hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>;
}

// assembling ObjectRepo
export class ObjectRepo {
    static instance: ObjectRepo;
    pool!: Pool;
    services!: Services;
    repos!: Repos;
    config!: Config;
    bcrypt!: BcryptInterf;
    schemas!: Schemas;
    constructor(
        pool: Pool,
        services: Services,
        repos: Repos,
        config: Config,
        bcrypt: BcryptInterf,
        schemas: Schemas
    ) {
        if (ObjectRepo.instance) {
            return ObjectRepo.instance;
        }

        this.pool = pool;
        this.services = services;
        this.repos = repos;
        this.config = config;
        this.bcrypt = bcrypt;
        this.schemas = schemas;
        ObjectRepo.instance = this;
    }
}
const objectRepo = new ObjectRepo(
    pool,
    services,
    repos,
    config,
    bcrypt,
    schemas
);
export default objectRepo;
