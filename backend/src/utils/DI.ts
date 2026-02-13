import { Pool } from "pg";
import pool from "./database.js";


// collect services and repos on object literals
import AuthService from "../auth/auth.service.js";

interface Services {
    AuthService: AuthService
}
const services: Services = {
    AuthService: new AuthService(),
};

interface Repos {

};
const repos: Repos = {};


export interface ObjectRepo {
    pool: object;
    services: Services;
    repos: Repos;
};

export class ObjectRepo {
    static instance: ObjectRepo;
    constructor(pool: Pool, services: Services, repos: Repos){
        if(ObjectRepo.instance){
            return ObjectRepo.instance;
        }

        this.pool = pool;
        this.services = services;
        this.repos = repos;

        ObjectRepo.instance = this;
    }
}
const objectRepo = new ObjectRepo(pool, services, repos);
export default objectRepo;