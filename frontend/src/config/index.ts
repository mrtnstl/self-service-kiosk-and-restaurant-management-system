type Roles = {
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
    BACKEND_BASE_URL: string;
    ROLES: Roles;
}
const config = {
    BACKEND_BASE_URL: "http://localhost:3000",
    ROLES: ROLES,
};

export default config;