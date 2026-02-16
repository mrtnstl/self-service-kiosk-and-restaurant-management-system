import jwt, { Secret, SignOptions } from "jsonwebtoken";
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
): Promise<{ error: Error; payload: AccessTokenPayload }> {
    return new Promise(resolve => {
        const { error, payload } = jwt.verify(
            token,
            config.ACCESS_TOKEN_SECRET
        ) as jwt.JwtPayload & AccessTokenPayload;
        resolve({ error, payload });
    });
}
