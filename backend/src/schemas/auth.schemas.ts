import * as z from "zod";
import constants from "../constants/index.js";

export const nonManagerUserSchema = z.object({
    name: z.string(),
    password: z.string().min(constants.PW_MIN_L),
    role: z.string(),
    restaurantId: z.uuid(),
    companyId: z.uuid(),
});

export const managerUserSchema = z.object({
    email: z.string(), 
    name: z.string(), 
    password: z.string().min(constants.PW_MIN_L), 
    companyId: z.string()
});