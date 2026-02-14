import { ObjectRepo } from "../utils/DI.js";

export class RestaurantService {
    private static instance: RestaurantService;
    constructor() {
        if (RestaurantService.instance) {
            return RestaurantService.instance;
        }
        RestaurantService.instance = this;
    }
    async createNewRestaurant(
        objectRepo: ObjectRepo,
        restaurant: { companyId: string; name: string; location: string }
    ) {
        const { repos } = objectRepo;
        try {
            const existingRestaurant =
                await repos.RestaurantRepo.getRestaurantByName(
                    objectRepo,
                    restaurant.name
                );
            if (existingRestaurant.rows.length > 0) {
                throw new Error("restaurant already exists.");
            }

            const result = await repos.RestaurantRepo.insertNewRestaurant(
                objectRepo,
                restaurant
            );
            return result.rows[0]["restaurant_id"];
        } catch (err: any) {
            throw err;
        }
    }
}

export default RestaurantService;
