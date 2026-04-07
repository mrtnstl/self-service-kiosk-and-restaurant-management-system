import { RequestHandler } from "express";
import OrderService from "./order.service.js";
import { IOrderSchema } from "./schemas/order.schema.js";
import { BadRequestError, ValidationError } from "../../common/errors/index.js";
import z from "zod";

class OrderController {
    constructor(private orderService: OrderService, private orderSchemas: IOrderSchema) {}
    createOrder(): RequestHandler {
        return async (req, res, _next) => {
            const { companyId, userId, restaurantId } = req.user;
            const { type, items } = req.body || {};
            if (typeof type === "undefined" || typeof items === "undefined") {
                throw new BadRequestError("Invalid arguments");
            }

            const { data, error } = this.orderSchemas.newOrderSchema.safeParse(
                req.body
            );
            if (error) {
                throw new ValidationError(z.flattenError(error).fieldErrors);
            }

            const orderOrigin = { companyId, userId, restaurantId };
            const newOrder = await this.orderService.createNewOrder(
                data,
                orderOrigin
            );
            return res.status(201).json(newOrder);
        };
    }
    changeOrderState(): RequestHandler {
        return async (req, res, _next) => {
            const { orderId, newState } = req.body || {};
            if (
                typeof orderId === "undefined" ||
                typeof newState === "undefined"
            ) {
                throw new BadRequestError("Invalid arguments");
            }

            const { data, error } =
                this.orderSchemas.changeOrderStateSchema.safeParse(req.body);
            if (error) {
                throw new ValidationError(z.flattenError(error).fieldErrors);
            }

            const changedOrder = await this.orderService.changeOrderState(data);
            return res.status(200).json(changedOrder);
        };
    }
    getPendingOrders(): RequestHandler {
        return async (req, res, _next) => {
            // get pending orders of restaurantId
            const { restaurantId } = req.user;
            const pendingOrders =
                await this.orderService.getPendingOrders(restaurantId);
            return res.status(200).json(pendingOrders);
        };
    }
}

export default OrderController;
