import { Router } from "express";
import { createRestaurantController } from "./restaurant.controller.factory.js";
import authenticationMW from "../../common/middleware/authenticationMW.js";
import authorizationMW from "../../common/middleware/authorizationMW.js";
import config from "../../config/index.js";

const restaurantController = createRestaurantController();

const restaurantRouter = Router();

restaurantRouter.get(
    "/",
    authenticationMW(),
    restaurantController.getRestaurantById()
);
restaurantRouter.post(
    "/",
    authenticationMW(),
    authorizationMW([config.ROLES.MANAGER]),
    restaurantController.createNewRestaurant()
);

export default restaurantRouter;
