import { Express } from "express";

import globalErrHandlerMW from "../common/middleware/globalErrHandlerMW.js";
import wildcardRouteHandlerMW from "../common/middleware/wildcardRouteHandlerMW.js";

import authRouter from "../features/auth/auth.routes.js";
import restaurantRouter from "../features/restaurant/restaurant.routes.js";
import companyRouter from "../features/company/company.routes.js";
import menuRouter from "../features/menu/menu.routes.js";
import orderRouter from "../features/order/order.routes.js";

// TODO: rate limiting
export function initRoutes(app: Express) {
    app.use("/api/v1/restaurant", restaurantRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/company", companyRouter);
    app.use("/api/v1/menu", menuRouter);
    app.use("/api/v1/order", orderRouter);
    app.use(wildcardRouteHandlerMW());
    app.use(globalErrHandlerMW());
}
