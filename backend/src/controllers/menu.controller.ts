import { RequestHandler } from "express";
import MenuService from "../services/menu.service.js";

class MenuController {
    private static instance: MenuController;
    private menuService!: MenuService;
    constructor(menuService: MenuService) {
        if (MenuController.instance) {
            return MenuController.instance;
        }
        this.menuService = menuService;
        MenuController.instance = this;
    }

    getAllDishOfCompany(): RequestHandler {
        return async (req, res) => {
            const { companyId } = req.user;
            const dishes =
                await this.menuService.selectAllDishOfCompany(companyId);
            return res.status(200).json(dishes);
        };
    }
}

export default MenuController;
