import AuthController from "./auth.controller.js";
import authSchemas from "../schemas/auth.schema.js";
import AuthService from "../services/auth.service.js";
import UserRepo from "../repositories/user.repository.js";
import pool from "../utils/database.js";
import NotificationService from "../services/external/notification.service.js";
import { sendEmail } from "../services/external/sendgrid/sendgrid.js";
import config from "../config/index.js";
import bcrypt from "bcrypt";

export function createAuthController(): AuthController {
    const userRepo = new UserRepo(pool);
    const notificationService = new NotificationService(sendEmail, config);

    const authService = new AuthService(userRepo, notificationService, bcrypt);

    return new AuthController(authSchemas, authService);
}
