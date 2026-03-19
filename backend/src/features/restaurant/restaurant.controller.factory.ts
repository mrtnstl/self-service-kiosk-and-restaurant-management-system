import RestaurantController from "./restaurant.controller.js";
import restaurantSchemas from "./schemas/restaurant.schema.js";
import RestaurantService from "./restaurant.service.js";
import RestaurantRepo from "./restaurant.repository.js";
import pool from "../../infrastructure/db/postgres.js";

export function createRestaurantController() {
    const restaurantRepo = new RestaurantRepo(pool);
    const restaurantService = new RestaurantService(restaurantRepo);
    return new RestaurantController(restaurantSchemas, restaurantService);
}
