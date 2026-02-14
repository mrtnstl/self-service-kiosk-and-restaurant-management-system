import { RequestHandler } from "express";
import { ObjectRepo } from "../utils/DI.js";

class RestaurantController {
    private static instance: RestaurantController;
    objectRepo!: ObjectRepo;

    constructor(objectRepo: ObjectRepo) {
        if (RestaurantController.instance) {
            return RestaurantController.instance;
        }
        this.objectRepo = objectRepo;
        RestaurantController.instance = this;
    }
    getRestaurantById(): RequestHandler {
        return async (_req, res) => {
            return res.status(200).json({ message: "hello from res" });
        };
    }
    createNewRestaurant(): RequestHandler {
        const { services, schemas } = this.objectRepo;
        return async (req, res) => {
            const { name, location } = req.body || {};
            //const { companyId } = req.user || undefined;
            const companyId = "102f6b03-945d-49ef-a561-8c7cf1fbd55b";
            if (
                typeof companyId === "undefined" ||
                typeof name === "undefined" ||
                typeof location === "undefined"
            ) {
                return res.status(401).json({ message: "bad request." });
            }

            const { data, error } =
                schemas.restaurantSchemas.newRestaurantSchema.safeParse({
                    ...req.body,
                    companyId,
                });
            if (error) {
                console.log(error);
                return res
                    .status(401)
                    .json({ message: "bad request. invalid arguments." });
            }

            try {
                const newRestaurantId =
                    await services.RestaurantService.createNewRestaurant(
                        this.objectRepo,
                        data!
                    );

                return res.status(201).json({
                    message: "new user registered successfully.",
                    newRestaurantId,
                });
            } catch (err: any) {
                return res.status(400).json({ message: err.message });
            }
        };
    }
}

export default RestaurantController;
