import * as z from "zod";
import constants from "../constants/index.js";

export const nonManagerUserSchema = z.object({
    name: z.string(),
    password: z.string().min(constants.PW_MIN_L),
    roleId: z.number(),
    restaurantId: z.uuid(),
    companyId: z.uuid(),
});

export const managerUserSchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string().min(constants.PW_MIN_L),
    companyId: z.string(),
});

export interface AuthSchemasInterf {
    nonManagerUserSchema: z.ZodObject<
        {
            name: z.ZodString;
            password: z.ZodString;
            roleId: z.ZodNumber;
            restaurantId: z.ZodUUID;
            companyId: z.ZodUUID;
        },
        z.core.$strip
    >;
    managerUserSchema: z.ZodObject<
        {
            email: z.ZodString;
            name: z.ZodString;
            password: z.ZodString;
            companyId: z.ZodString;
        },
        z.core.$strip
    >;
}
const authSchemas: AuthSchemasInterf = {
    nonManagerUserSchema,
    managerUserSchema,
};
export default authSchemas;
