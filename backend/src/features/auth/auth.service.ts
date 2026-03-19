import {
    UnauthorizedError,
    InternalServerError,
    AppError,
} from "../../common/errors/index.js";
import { genAccessToken } from "../../common/helpers/auth.helpers.js";
import { type IAuthRepository } from "./auth.repository.js";
import UserRepo from "./user.repository.js";
import { AccessTokenPayload } from "../../types/token.js";
import {
    ApplianceLogin,
    UserManager,
    UserManagerNew,
    UserRegural,
    UserReguralNew,
} from "../../types/user.js";
import { ICryptoUtil } from "../../types/utility.js";
import logger from "../../common/utils/logger.js";
import { INotificationService } from "../../infrastructure/notification/notification.service.js";

type TApplianceUserFE = { name: string; roleId: number };

export interface IAuthService {
    registerNewCompanyManager(data: UserManager): Promise<void>;
    loginUser(): Promise<void>;
    logoutUser(): Promise<void>;
    authenticateAppliance(
        data: ApplianceLogin
    ): Promise<{ applianceUser: TApplianceUserFE; accessToken: string }>;
    registerNewApplianceUser(data: UserRegural): Promise<void>;
    setVerifiedUser(token: string): Promise<void>;
    setVerifiedUserFalse(userId: string): Promise<void>;
}

export class AuthService implements IAuthService {
    constructor(
        private userRepo: UserRepo,
        private authRepo: IAuthRepository,
        private notificationService: INotificationService,
        private bcrypt: ICryptoUtil
    ) {}

    async registerNewCompanyManager(data: UserManager): Promise<void> {
        const { email, name, companyId, password } = data;
        try {
            const existingUser = await this.userRepo.getUserByEmail(email);
            if (existingUser.rows.length > 0) {
                throw new Error("User already exists");
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

            await this.notificationService.sendAccountVerificationEmail({
                email: newManager.email,
                name: newManager.name,
                accountVerificationSecret: newManager.usersecrettoken,
            });

            return;
        } catch (err: any) {
            throw err;
        }
    }
    async loginUser() {
        throw new InternalServerError("NOT IMPLEMENTED");
    }
    async logoutUser() {
        throw new InternalServerError("NOT IMPLEMENTED");
    }
    async authenticateAppliance(
        data: ApplianceLogin
    ): Promise<{ applianceUser: TApplianceUserFE; accessToken: string }> {
        const result = await this.userRepo.getUserByName(data.name);
        if (result.rowCount === 0) {
            throw new UnauthorizedError("Invalid login credentials");
        }
        const userFromDB = result.rows[0];

        if (!userFromDB["is_verified"] || !userFromDB["restaurant_id"]) {
            throw new UnauthorizedError("Not verified user");
        }

        const isValidPw = await this.bcrypt.compare(
            data.password,
            userFromDB["pw_hash"]
        );
        if (!isValidPw) {
            throw new UnauthorizedError("Invalid login credentials");
        }

        const payload: AccessTokenPayload = {
            userId: userFromDB["id"],
            restaurantId: userFromDB["restaurant_id"],
            companyId: userFromDB["company_id"],
            roleId: userFromDB["role_id"],
        };
        const accessToken = await genAccessToken(payload);
        const applianceUser: TApplianceUserFE = {
            name: userFromDB["name"],
            roleId: userFromDB["role_id"],
        };
        return { applianceUser, accessToken };
    }
    async registerNewApplianceUser(data: UserRegural): Promise<void> {
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

            await this.userRepo.insertNewApplianceUser(user);
            return;
        } catch (err: any) {
            throw err;
        }
    }
    async setVerifiedUser(token: string): Promise<void> {
        try {
            const verification =
                await this.authRepo.setUserVerifiedToTrue(token);
            if (verification.rowCount === null || verification.rowCount > 1) {
                // az baj!
                logger.error(
                    { count: verification.rowCount },
                    "Multiple rows were updated during user verification"
                );
            }
            return;
        } catch (err) {
            logger.error(err, "User verification failed");

            if (err instanceof AppError) {
                throw err;
            }

            throw new InternalServerError(
                "An error occured while proccessing your request"
            );
        }
    }
    async setVerifiedUserFalse(userId: string): Promise<void> {
        try {
            const setFasle = await this.authRepo.setUserVerifiedToFlase(userId);
            if (setFasle.rowCount === null || setFasle.rowCount > 1) {
                logger.error(
                    { count: setFasle.rowCount },
                    "Multiple rows were updated during disabling user verification"
                );
            }
            return;
        } catch (err) {
            logger.error(err, "Disabling user verification failed");

            if (err instanceof AppError) {
                throw err;
            }

            throw new InternalServerError(
                "An error occured while proccessing your request"
            );
        }
    }
}
