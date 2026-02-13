import { Express } from "express";

import authRouter from "./authRoutes.js";
import restaurantRouter from "./restaurantRoutes.js";
import companyRouter from "./companyRoutes.js";

export function initRoutes(app: Express) {
    app.use("/api/v1/restaurant", restaurantRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/company", companyRouter);
}
