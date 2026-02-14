import { UUID } from "node:crypto";
import UserRepo from "../repositories/user.repository.js";

export interface AuthService {
    UserRepo: UserRepo;
}

export class AuthService {
    private static instance: AuthService;
    constructor(UserRepo: UserRepo) {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        this.UserRepo = UserRepo;
        AuthService.instance = this;
    }
    async registerNewCompanyManager(data: {
        email: string,
        name: string,
        companyId: string
        password: string
    }) {
        // TODO: check if user exists, create psHash and salt, call user repo, insertNewManagerUser
        // respond
        const {email, name, companyId, password} = data;
        try {
            const existingUser = await this.UserRepo.getUserByEmail(email);
            console.log(existingUser);
            if (existingUser.rows.length > 0) {
                throw new Error("user already exists.");
            }

            const user: {
                name: string;
                email: string;
                companyId: string;
                pwHash: string;
                pwSalt: string;
            } = {
                name: name,
                email: email,
                companyId: companyId,
                pwHash: "asd",
                pwSalt: "asd",
            };
            const newManager = await this.UserRepo.insertNewManagerUser(user);
            return newManager;
        } catch (err: any) {
            throw err;
        }
    }
    async loginUser() {
        // TODO: call user repo, getUserByEmailOrName, create token, set cookie(s)
        // respond
        return "login user serv";
    }
    async logoutUser() {
        // TODO: destroy token and clear cookie(s)
        // respond
        return "logout user serv";
    }
    async registerNewNonManagerUser(data: {
        name: string;
        password: string;
        role: string;
        restaurantId: string;
        companyId: string;
    }) {
        const { name, password, role, restaurantId, companyId } = data;
        try {
            const existingUser = await this.UserRepo.getUserByName(name);
            if (existingUser.rows.length > 0) {
                throw new Error("user already exists.");
            }

            // TODO: gen pwhash
            const user: {
                name: string;
                role: string;
                restaurantId: string;
                companyId: string;
                pwHash: string;
                pwSalt: string;
            } = {
                name: name,
                role: role,
                restaurantId: restaurantId,
                companyId: companyId,
                pwHash: "asd",
                pwSalt: "asd",
            };

            const newUser = await this.UserRepo.insertNewInternalUser(user);
            return newUser;
        } catch (err: any) {
            throw err;
        }
    }
}

export default AuthService;
