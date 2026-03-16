export type Roles = {
    MANAGER: number;
    KITCHEN_MONITOR: number;
    ORDER_MONITOR: number;
    KIOSK: number;
};
const ROLES: Roles = {
    MANAGER: 1,
    KITCHEN_MONITOR: 2,
    ORDER_MONITOR: 3,
    KIOSK: 4,
};

export interface Config {
    PORT: string;
    NODE_ENV: string;
    BASE_URL: string;
    FRONTEND_URL: string;
    DATABASE_CONNECTION_STRING: string;
    CORS_OPTIONS: { origin: string; credentials: boolean };
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXP_MS: number;
    ROLES: Roles;
    ORDER_SERIAL_INITIAL: number;
    IS_NOTIF_ON: boolean;
    REDIS_URL: string;
}
const config: Config = {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    BASE_URL: process.env.BASE_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    DATABASE_CONNECTION_STRING: process.env
        .DATABASE_CONNECTION_STRING as string,
    CORS_OPTIONS: {
        origin: process.env.FRONTEND_URL as string,
        credentials: true,
    },
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXP_MS: parseInt(process.env.ACCESS_TOKEN_EXP as string),
    ROLES: ROLES,
    ORDER_SERIAL_INITIAL: 1,
    IS_NOTIF_ON: Boolean(process.env.IS_NOTIF_ON),
    REDIS_URL: process.env.REDIS_URL as string
};

export default config;
