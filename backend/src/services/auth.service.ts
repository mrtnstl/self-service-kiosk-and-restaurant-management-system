import { ObjectRepo } from "../utils/DI.js";

export interface AuthServiceIntrf {}
export class AuthService implements AuthServiceIntrf {
    private static instance: AuthService;
    constructor() {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        AuthService.instance = this;
    }
    async registerNewCompanyManager(objectRepo: ObjectRepo, 
        data: {
            email: string,
            name: string,
            companyId: string
            password: string
        }) {
        // TODO: create psHash and salt
        
        const {repos} = objectRepo;
        const {email, name, companyId, password} = data;
        try {
            const existingUser = await repos.UserRepo.getUserByEmail(objectRepo,email);
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
            const newManager = await repos.UserRepo.insertNewManagerUser(objectRepo, user);
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
    async registerNewNonManagerUser(
        objectRepo: ObjectRepo,
        data: {
            name: string;
            password: string;
            roleId: number;
            restaurantId: string;
            companyId: string;
        }) {
            const {repos} = objectRepo;
        const { name, password, roleId, restaurantId, companyId } = data;
        try {
            const existingUser = await repos.UserRepo.getUserByName(objectRepo, name);
            if (existingUser.rows.length > 0) {
                throw new Error("user already exists.");
            }

            
            const user: {
                name: string;
                roleId: number;
                restaurantId: string;
                companyId: string;
                pwHash: string;
                pwSalt: string;
            } = {
                name: name,
                roleId: roleId,
                restaurantId: restaurantId,
                companyId: companyId,
                pwHash: "asd",
                pwSalt: "asd",
            };

            const newUser = await repos.UserRepo.insertNewInternalUser(objectRepo, user);
            return newUser;
        } catch (err: any) {
            throw err;
        }
    }
}

export default AuthService;
