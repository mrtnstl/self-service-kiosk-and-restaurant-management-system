import { getRedisClient } from "../../infrastructure/cache/redis.js";
import DishRepo from "../company/dish.repository.js";
import logger from "../../common/utils/logger.js";

export class MenuService {
    constructor(private dishRepo: DishRepo) {}
    async selectAllDishOfCompany(companyId: string) {
        try {
            // THIS IS TEMP. MENU SHOULD BE FETCHED FROM menus/menu_items TABLES WHEN DONE
            const client = await getRedisClient();
            const key = `cache:menu:${companyId}`;

            const cached = await client.get(key);
            if (cached) {
                logger.debug("CACHE HIT: get dishes");

                return cached;
            }
            logger.debug("CACHE MISS: get dishes");

            client.setEx(key, 60, JSON.stringify({ dummy: "data" }));

            const dishes =
                await this.dishRepo.selectAllDishOfCompany(companyId);
            return dishes.rows;
        } catch (err: any) {
            throw err;
        }
    }
}

export default MenuService;
