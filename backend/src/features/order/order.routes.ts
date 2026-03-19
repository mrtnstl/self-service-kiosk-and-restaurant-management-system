import { Router } from "express";
import { createOrderController } from "./order.controller.factory.js";
import authenticationMW from "../../common/middleware/authenticationMW.js";
import authorizationMW from "../../common/middleware/authorizationMW.js";
import config from "../../config/index.js";
const { ROLES } = config;
const orderContrlr = createOrderController();

const orderRouter = Router();

orderRouter.post(
    "/",
    authenticationMW(),
    authorizationMW([ROLES.KIOSK, ROLES.MANAGER]),
    orderContrlr.createOrder()
);
orderRouter.put(
    "/state",
    authenticationMW(),
    authorizationMW([ROLES.KITCHEN_MONITOR, ROLES.MANAGER]),
    orderContrlr.changeOrderState()
);
orderRouter.get(
    "/pending",
    authenticationMW(),
    authorizationMW([ROLES.KITCHEN_MONITOR, ROLES.MANAGER]),
    orderContrlr.getPendingOrders()
); // sse?

export default orderRouter;
