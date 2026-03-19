import { type Config, type Roles } from "../config/index";

describe("app config", () => {
    const mockRoles: Roles = {
        MANAGER: 234,
        KITCHEN_MONITOR: 234,
        ORDER_MONITOR: 234,
        KIOSK: 234,
    };
    const mockConfig: Config = {
        PORT: "String",
        NODE_ENV: "String",
        BASE_URL: "String",
        FRONTEND_URL: "String",
        DATABASE_CONNECTION_STRING: "String",
        CORS_OPTIONS: {
            origin: "String",
            credentials: true,
        },
        ACCESS_TOKEN_SECRET: "String",
        ACCESS_TOKEN_EXP_MS: 0,
        ROLES: mockRoles,
        ORDER_SERIAL_INITIAL: 0,
        IS_NOTIF_ON: true,
    };
    it("values should be defined and conforming to type", () => {
        expect(typeof mockConfig.PORT).toBe("string");
        expect(typeof mockConfig.CORS_OPTIONS.credentials).toBe("boolean");
        expect(typeof mockConfig.ROLES).toBe("object");
    });
});
