import { Pool } from "pg";
import pool from "./database.js";
import config, { Config } from "../config/index.js";
import bcrypt from "bcrypt";

import UserRepo from "../repositories/user.repository.js";
import CompanyRepo from "../repositories/company.repository.js";

import AuthService from "../services/auth.service.js";
import CompanyService from "../services/company.service.js";

import authSchemas, {AuthSchemasInterf} from "../schemas/auth.schemas.js";
import companySchemas,{CompanySchemasInterf} from "../schemas/company.schemas.js";
// repos
interface Repos {
    UserRepo: UserRepo;
    CompanyRepo: CompanyRepo;
}
const repos: Repos = {
    UserRepo: new UserRepo(),
    CompanyRepo: new CompanyRepo(),
};

// services
interface Services {
    AuthService: AuthService;
    CompanyService: CompanyService;
}
const services: Services = {
    AuthService: new AuthService(),
    CompanyService: new CompanyService(),
};
// schemas
interface Schemas {
    authSchemas: AuthSchemasInterf;
    companySchemas: CompanySchemasInterf;
}
const schemas: Schemas ={
    authSchemas: authSchemas,
    companySchemas: companySchemas
};

// assembling ObjectRepo
export interface ObjectRepoInterf {
    pool: Pool;
    services: Services;
    repos: Repos;
    config: Config;
    bcrypt: object;
    schemas: Schemas
}

export class ObjectRepo implements ObjectRepoInterf{
    static instance: ObjectRepo;
    pool!: Pool;
    services!: Services;
    repos!: Repos;
    config!: Config;
    bcrypt!: object;
    schemas!: Schemas;
    constructor(pool: Pool, services: Services, repos: Repos, config: Config, bcrypt: object, schemas: Schemas) {
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
const objectRepo = new ObjectRepo(pool, services, repos, config, bcrypt, schemas);
export default objectRepo;
