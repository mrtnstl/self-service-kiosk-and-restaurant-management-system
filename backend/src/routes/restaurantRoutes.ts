import { Router } from "express";
import ObjectRepo from "../utils/DI.js";

import RestaurantController from "../restaurant/restaurant.controller.js";

const restaurantController = new RestaurantController(ObjectRepo);

const restaurantRouter = Router();

restaurantRouter.get("/", restaurantController.getRestaurantData());

export default restaurantRouter;
