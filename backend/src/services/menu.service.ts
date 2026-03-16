import { getRedisClient } from "../config/redis.js";
import DishRepo from "../repositories/dish.repository.js";
import logger from "../utils/logger.js";

export class MenuService {
    private static instance: MenuService;
    dishRepo!: DishRepo;
    constructor(dishRepo: DishRepo) {
        if (MenuService.instance) {
            return MenuService.instance;
        }
        this.dishRepo = dishRepo;
        MenuService.instance = this;
    }
    async selectAllDishOfCompany(companyId: string) {
        try {
            // THIS IS TEMP. MENU SHOULD BE FETCHED FROM menus/menu_items TABLES WHEN DONE
            const client = await getRedisClient();
            const key = `cache:menu:${companyId}`;

            const cached = await client.get(key);
            if(cached){
                logger.debug("CACHE HIT: get dishes")

                return cached;
            }
            logger.debug("CACHE MISS: get dishes")

            client.setEx(key, 60, JSON.stringify({dummy: "data"}));
            
            const dishes =
                await this.dishRepo.selectAllDishOfCompany(companyId);
            return dishes.rows;
        } catch (err: any) {
            throw err;
        }
    }
}

export default MenuService;
