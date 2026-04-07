import { Pool } from "pg";

export class RestaurantRepo {
    constructor(private pool: Pool) { }
    async getRestaurantByName(name: string) {
        const restaurant = await this.pool.query(
            "SELECT id, company_id, name FROM restaurants WHERE name = $1;",
            [name]
        );
        return restaurant;
    }
    async insertNewRestaurant(restaurant: {
        companyId: string;
        name: string;
        location: string;
    }) {
        const newRestaurantId = this.pool.query(
            "INSERT INTO restaurants (company_id, name, location) VALUES ($1, $2, $3) RETURNING id as restaurant_id",
            [restaurant.companyId, restaurant.name, restaurant.location]
        );
        return newRestaurantId;
    }
}

export default RestaurantRepo;
