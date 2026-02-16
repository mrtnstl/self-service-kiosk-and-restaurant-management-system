import UserRepo from "../repositories/user.repository.js";
import {
    UserManager,
    UserManagerNew,
    UserRegural,
    UserReguralNew,
} from "../types/user.js";
import { BcryptInterf } from "../types/utility.js";
import NotificationService from "./external/notification.service.js";

export interface AuthServiceIntrf {}
export class AuthService implements AuthServiceIntrf {
    private static instance: AuthService;
    userRepo!: UserRepo;
    notificationService!: NotificationService;
    bcrypt!: BcryptInterf;

    constructor(
        userRepo: UserRepo,
        notificationService: NotificationService,
        bcrypt: BcryptInterf
    ) {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        this.userRepo = userRepo;
        this.notificationService = notificationService;
        this.bcrypt = bcrypt;
        AuthService.instance = this;
    }

    async registerNewCompanyManager(data: UserManager) {
        const { email, name, companyId, password } = data;
        try {
            const existingUser = await this.userRepo.getUserByEmail(email);
            if (existingUser.rows.length > 0) {
                throw new Error("user already exists.");
            }

            const pwSalt = await this.bcrypt.genSalt(8);
            const pwHash = await this.bcrypt.hash(password, pwSalt);

            const user: UserManagerNew = {
                name: name,
                email: email,
                companyId: companyId,
                pwHash: pwHash,
                pwSalt: pwSalt,
            };
            const newManager = (await this.userRepo.insertNewManagerUser(user))
                .rows[0];

            // TEMP: fire and forget
            // TODO: emit notification event
            this.notificationService.sendAccountVerificationEmail({
                email: newManager.email,
                name: newManager.name,
                accountVerificationSecret: "some_secret_123",
            });

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
    async registerNewNonManagerUser(data: UserRegural) {
        const { name, password, roleId, restaurantId, companyId } = data;
        try {
            const existingUser = await this.userRepo.getUserByName(name);
            if (existingUser.rows.length > 0) {
                throw new Error("user already exists.");
            }

            const pwSalt = await this.bcrypt.genSalt(8);
            const pwHash = await this.bcrypt.hash(password, pwSalt);

            const user: UserReguralNew = {
                name: name,
                roleId: roleId,
                restaurantId: restaurantId,
                companyId: companyId,
                pwHash: pwHash,
                pwSalt: pwSalt,
            };

            const newUser = await this.userRepo.insertNewInternalUser(user);
            return newUser;
        } catch (err: any) {
            throw err;
        }
    }
}

export default AuthService;
