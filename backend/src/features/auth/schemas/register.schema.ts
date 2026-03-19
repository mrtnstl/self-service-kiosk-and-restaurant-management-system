import { z } from "zod";

export const registerSchema = z.object({
    email: z
        .email({ message: "Invalid email" })
        .min(1, "Email is required"),

    password: z
        .string()
        .min(8, "At least 8 character")
        .max(64, "Too long")
        .regex(/[a-z]/, "At least one lowercase character")
        .regex(/[A-Z]/, "At least one uppercase character")
        .regex(/[0-9]/, "At least one digit"),

    username: z
        .string()
        .min(3, "At least 3 character")
        .max(20, "At most 20 character")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, digits and _ allowed"),

    /*acceptTerms: z.literal(true, {
        errorMap: () => ({ message: "TODO: ÁSZF-et el kell fogadtatni" }),
    }),*/
});

export type RegisterInput = z.infer<typeof registerSchema>;
