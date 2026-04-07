import { RequestHandler } from "express";
import MenuService from "./menu.service.js";

class MenuController {
    constructor(private menuService: MenuService) {}

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
