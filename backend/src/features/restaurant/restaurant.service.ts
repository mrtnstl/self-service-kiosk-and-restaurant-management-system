import RestaurantRepo from "./restaurant.repository.js";

export class RestaurantService {
    private static instance: RestaurantService;
    restaurantRepo!: RestaurantRepo;
    constructor(restaurantRepo: RestaurantRepo) {
        if (RestaurantService.instance) {
            return RestaurantService.instance;
        }
        this.restaurantRepo = restaurantRepo;
        RestaurantService.instance = this;
    }
    async createNewRestaurant(restaurant: {
        companyId: string;
        name: string;
        location: string;
    }) {
        try {
            const existingRestaurant =
                await this.restaurantRepo.getRestaurantByName(restaurant.name);
            if (existingRestaurant.rows.length > 0) {
                throw new Error("restaurant already exists.");
            }

            const result =
                await this.restaurantRepo.insertNewRestaurant(restaurant);
            return result.rows[0]["restaurant_id"];
        } catch (err: any) {
            throw err;
        }
    }
}

export default RestaurantService;
