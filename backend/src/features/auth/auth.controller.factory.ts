import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { AuthRepository } from "./auth.repository.js";

import authSchemas from "./schemas/auth.schema.js";
import UserRepo from "./user.repository.js";
import pool from "../../infrastructure/db/postgres.js";
import { NotificationService } from "../../infrastructure/notification/notification.service.js";
import { SendGridEmailService } from "../../infrastructure/notification/sendGrid.js";
import config from "../../config/index.js";
import bcrypt from "bcrypt";

export function createAuthController(): AuthController {
    const emailService = new SendGridEmailService();
    
    const userRepo = new UserRepo(pool);
    const notificationService = new NotificationService(emailService.sendEmail , config);
    const authRepo = new AuthRepository(pool);

    const authService = new AuthService(
        userRepo,
        authRepo,
        notificationService,
        bcrypt
    );

    return new AuthController(authSchemas, authService);
}
