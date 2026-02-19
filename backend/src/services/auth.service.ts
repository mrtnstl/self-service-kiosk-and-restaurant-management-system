import { AuthenticationError, DatabaseError } from "../errors/index.js";
import { genAccessToken } from "../helpers/auth.helpers.js";
import AuthRepo from "../repositories/auth.repository.js";
import UserRepo from "../repositories/user.repository.js";
import { AccessTokenPayload } from "../types/token.js";
import {
    ApplianceLogin,
    UserManager,
    UserManagerNew,
    UserRegural,
    UserReguralNew,
} from "../types/user.js";
import { BcryptInterf } from "../types/utility.js";
import logger from "../utils/logger.js";
import NotificationService from "./external/notification.service.js";

export class AuthService {
    private static instance: AuthService;
    userRepo!: UserRepo;
    authRepo!: AuthRepo;
    notificationService!: NotificationService;
    bcrypt!: BcryptInterf;

    constructor(
        userRepo: UserRepo,
        authRepo: AuthRepo,
        notificationService: NotificationService,
        bcrypt: BcryptInterf
    ) {
        if (AuthService.instance) {
            return AuthService.instance;
        }
        this.userRepo = userRepo;
        this.authRepo = authRepo;
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

            const userSecretToken = crypto.randomUUID();

            const user: UserManagerNew = {
                name: name,
                email: email,
                companyId: companyId,
                pwHash: pwHash,
                pwSalt: pwSalt,
                userSecretToken: userSecretToken,
            };
            const newManager = (await this.userRepo.insertNewManagerUser(user))
                .rows[0];

            // TEMP: fire and forget
            // TODO: emit notification event
            this.notificationService.sendAccountVerificationEmail({
                email: newManager.email,
                name: newManager.name,
                accountVerificationSecret: newManager.usersecrettoken,
            });

            return newManager;
        } catch (err: any) {
            throw err;
        }
    }
    async loginUser() {
        return "login user serv";
    }
    async logoutUser() {
        return "logout user serv";
    }
    async authenticateAppliance(data: ApplianceLogin) {
        const result = await this.userRepo.getUserByName(data.name);
        if (result.rowCount === 0) {
            throw new AuthenticationError("Invalid login credentials");
        }
        const userFromDB = result.rows[0];

        if (!userFromDB["is_verified"] || !userFromDB["restaurant_id"]) {
            throw new AuthenticationError("Not verified user");
        }

        const isValidPw = await this.bcrypt.compare(
            data.password,
            userFromDB["pw_hash"]
        );
        if (!isValidPw) {
            throw new AuthenticationError("Invalid login credentials");
        }

        const payload: AccessTokenPayload = {
            userId: userFromDB["id"],
            restaurantId: userFromDB["restaurant_id"],
            companyId: userFromDB["company_id"],
            roleId: userFromDB["role_id"],
        };
        const accessToken = await genAccessToken(payload);
        const applianceUser = {
            name: userFromDB["name"],
            roleId: userFromDB["role_id"],
        };
        return { applianceUser, accessToken };
    }
    async registerNewApplianceUser(data: UserRegural) {
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

            const newUser = await this.userRepo.insertNewApplianceUser(user);
            return newUser;
        } catch (err: any) {
            throw err;
        }
    }
    async setVerifiedUser(token: string) {
        try {
            const verification =
                await this.authRepo.updateUserIsVerifiedToTrue(token);
            if (verification.rowCount! > 1) {
                // az baj!
                logger.error(
                    { count: verification.rowCount },
                    "Multiple rows were updated during user verification"
                );
            }
            return verification;
        } catch (err) {
            logger.error(err, "User verification failed");
            throw new DatabaseError(
                "An error occured while proccessing your request"
            );
        }
    }
    async setVerifiedUserFalse(userId: string) {
        try {
            const setFasle =
                await this.authRepo.updateUserIsVerifiedToFalse(userId);
            if (setFasle.rowCount! > 1) {
                logger.error(
                    { count: setFasle.rowCount },
                    "Multiple rows were updated during disabling user verification"
                );
            }
            return setFasle;
        } catch (err) {
            logger.error(err, "Disabling user verification failed");
            throw new DatabaseError(
                "An error occured while proccessing your request"
            );
        }
    }
}

export default AuthService;
