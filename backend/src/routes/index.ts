import { Express } from "express";

import globalErrHandlerMW from "../middleware/globalErrHandlerMW.js";
import wildcardRouteHandlerMW from "../middleware/wildcardRouteHandlerMW.js";

import authRouter from "./auth.routes.js";
import restaurantRouter from "./restaurant.routes.js";
import companyRouter from "./company.routes.js";

// TODO: rate limiting
export function initRoutes(app: Express) {
    app.use("/api/v1/restaurant", restaurantRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/company", companyRouter);
    app.use(wildcardRouteHandlerMW());
    app.use(globalErrHandlerMW());
}
