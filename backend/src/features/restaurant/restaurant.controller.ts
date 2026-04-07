import { RequestHandler } from "express";
import { RestaurantSchemasInterf } from "./schemas/restaurant.schema.js";
import RestaurantService from "./restaurant.service.js";
import { BadRequestError, ValidationError } from "../../common/errors/index.js";
import z from "zod";

class RestaurantController {
    constructor(
        private restaurantSchemas: RestaurantSchemasInterf,
        private restaurantService: RestaurantService
    ) {}

    getRestaurantById(): RequestHandler {
        return async (_req, res) => {
            return res.status(200).json({ message: "hello from res" });
        };
    }
    createNewRestaurant(): RequestHandler {
        return async (req, res, next) => {
            const { name, location } = req.body || {};
            const { companyId } = req.user || undefined;
            if (
                typeof companyId === "undefined" ||
                typeof name === "undefined" ||
                typeof location === "undefined"
            ) {
                throw new BadRequestError("Missing arguments");
            }

            const { data, error } =
                this.restaurantSchemas.newRestaurantSchema.safeParse({
                    ...req.body,
                    companyId,
                });
            if (error) {
                throw new ValidationError(z.flattenError(error).fieldErrors);
            }

            try {
                const newRestaurantId =
                    await this.restaurantService.createNewRestaurant(data!);

                return res.status(201).json({
                    message: "new user registered successfully.",
                    newRestaurantId,
                });
            } catch (err: any) {
                return next(err);
            }
        };
    }
}

export default RestaurantController;
