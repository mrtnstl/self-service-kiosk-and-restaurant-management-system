import { Router } from "express";
import { createRestaurantController } from "../controllers/restaurant.controller.factory.js";
import authenticationMW from "../middleware/authenticationMW.js";
import authorizationMW from "../middleware/authorizationMW.js";
import config from "../config/index.js";

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
