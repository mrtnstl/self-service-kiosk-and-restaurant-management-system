import DishRepo from "../repositories/dish.repository.js";
import MenuService from "../services/menu.service.js";
import pool from "../utils/database.js";
import MenuController from "./menu.controller.js";

export function createMenuController() {
    const dishRepo = new DishRepo(pool);
    const menuService = new MenuService(dishRepo);
    return new MenuController(menuService);
}
