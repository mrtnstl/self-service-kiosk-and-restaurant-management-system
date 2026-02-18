import jwt, { Secret, SignOptions, TokenExpiredError } from "jsonwebtoken";
import config from "../config/index.js";
import { AccessTokenPayload } from "../types/token.js";

export async function genAccessToken(payload: AccessTokenPayload) {
    return new Promise(resolve => {
        const token = jwt.sign(
            payload,
            config.ACCESS_TOKEN_SECRET as Secret,
            { expiresIn: config.ACCESS_TOKEN_EXP_MS } as SignOptions
        );
        resolve(token);
    });
}
export function decodeAccessToken(
    token: string
): Promise<AccessTokenPayload | Error> {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(
                token,
                config.ACCESS_TOKEN_SECRET
            ) as AccessTokenPayload;
            resolve(decoded);
        } catch (err: any) {
            reject(err);
        }
    });
}
