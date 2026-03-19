import orderHelpers from "../../common/helpers/order.helpers.js";
import OrderRepo from "./order.repository.js";
import orderSchemas from "./schemas/order.schema.js";
import OrderService from "./order.service.js";
import pool from "../../infrastructure/db/postgres.js";
import OrderController from "./order.controller.js";

export function createOrderController(): OrderController {
    const orderRepo = new OrderRepo(pool);
    const orderService = new OrderService(orderRepo, orderHelpers);
    return new OrderController(orderService, orderSchemas);
}
