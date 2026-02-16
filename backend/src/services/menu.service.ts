import DishRepo from "../repositories/dish.repository.js";

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
            const dishes =
                await this.dishRepo.selectAllDishOfCompany(companyId);
            return dishes.rows;
        } catch (err: any) {
            throw err;
        }
    }
}

export default MenuService;
