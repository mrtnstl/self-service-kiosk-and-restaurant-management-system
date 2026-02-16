import RestaurantController from "./restaurant.controller.js";
import restaurantSchemas from "../schemas/restaurant.schema.js";
import RestaurantService from "../services/restaurant.service.js";
import RestaurantRepo from "../repositories/restaurant.repository.js";
import pool from "../utils/database.js";

export function createRestaurantController() {
    const restaurantRepo = new RestaurantRepo(pool);
    const restaurantService = new RestaurantService(restaurantRepo);
    return new RestaurantController(restaurantSchemas, restaurantService);
}
