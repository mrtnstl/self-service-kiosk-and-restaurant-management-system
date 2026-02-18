import orderHelpers from "../helpers/order.helpers.js";
import OrderRepo from "../repositories/order.repository.js";
import orderSchemas from "../schemas/order.schema.js";
import OrderService from "../services/order.service.js";
import pool from "../utils/database.js";
import OrderController from "./order.controller.js";

export function createOrderController(): OrderController {
    const orderRepo = new OrderRepo(pool);
    const orderService = new OrderService(orderRepo, orderHelpers);
    return new OrderController(orderService, orderSchemas);
}
