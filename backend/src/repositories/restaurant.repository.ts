import { ObjectRepo } from "../utils/DI.js";

export class RestaurantRepo {
    private static instance: RestaurantRepo;
    constructor() {
        if (RestaurantRepo.instance) {
            return RestaurantRepo.instance;
        }
        RestaurantRepo.instance = this;
    }
    async getRestaurantByName(objectRepo: ObjectRepo, name: string) {
        const restaurant = await objectRepo.pool.query(
            "SELECT id, company_id, name FROM restaurants WHERE name = $1;",
            [name]
        );
        return restaurant;
    }
    async insertNewRestaurant(
        objectRepo: ObjectRepo,
        restaurant: { companyId: string; name: string; location: string }
    ) {
        const newRestaurantId = objectRepo.pool.query(
            "INSERT INTO restaurants (company_id, name, location) VALUES ($1, $2, $3) RETURNING id as restaurant_id",
            [restaurant.companyId, restaurant.name, restaurant.location]
        );
        return newRestaurantId;
    }
}

export default RestaurantRepo;
