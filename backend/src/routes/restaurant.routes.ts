import { Router } from "express";
import { createRestaurantController } from "../controllers/restaurant.controller.factory.js";

const restaurantController = createRestaurantController();

const restaurantRouter = Router();

restaurantRouter.get("/", /*authMW*/ restaurantController.getRestaurantById());
restaurantRouter.post(
    "/",
    /*authMW authorizeMW*/ restaurantController.createNewRestaurant()
);

export default restaurantRouter;
