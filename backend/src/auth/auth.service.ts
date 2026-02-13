import { UUID } from "node:crypto";
import UserRepo from "./user.repository.js";

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
    async registerNewCompanyManager(email: string, name: string, companyId: UUID ) {
        // TODO: check if user exists, create psHash and salt, call user repo, insertNewManagerUser
        // respond
        try {
            const existingUser = await this.UserRepo.getUserByEmail(email);
            console.log(existingUser)
            if(existingUser.rows.length > 0){
                throw new Error("user already exists.");
            }
            
            const user: {name: string, email: string, companyId: UUID, pwHash: string, pwSalt: string} = {
                name: name,
                email: email,
                companyId: companyId,
                pwHash: "asd",
                pwSalt: "asd",
            };
            const newManager = await this.UserRepo.insertNewManagerUser(user);
            return newManager;
        } catch(err:any){
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
}

export default AuthService;
