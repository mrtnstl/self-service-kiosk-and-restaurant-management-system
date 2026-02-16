export interface Config {
    PORT: string;
    NODE_ENV: string;
    BASE_URL: string;
    FRONTEND_URL: string;
    DATABASE_CONNECTION_STRING: string;
    CORS_OPTIONS: { origin: string; credentials: boolean };
}
const config: Config = {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    BASE_URL: process.env.BASE_URL as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    DATABASE_CONNECTION_STRING: process.env
        .DATABASE_CONNECTION_STRING as string,
    CORS_OPTIONS: { origin: process.env.FRONTEND_URL || "", credentials: true },
};

export default config;
