export interface Config {
    PORT: string,
    NODE_ENV: string,
    FRONTEND_URL: string,
    DATABASE_CONNECTION_STRING: string,
    CORS_OPTIONS: {origin: string, credentials: boolean}
}
const config: Config = {
    PORT: process.env.PORT || "",
    NODE_ENV: process.env.NODE_ENV || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "",
    DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING || "",
    CORS_OPTIONS: {origin: process.env.FRONTEND_URL || "", credentials: true}
};

export default config;