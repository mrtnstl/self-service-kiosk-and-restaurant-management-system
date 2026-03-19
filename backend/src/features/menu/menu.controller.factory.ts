import DishRepo from "../company/dish.repository.js";
import MenuService from "./menu.service.js";
import pool from "../../infrastructure/db/postgres.js";
import MenuController from "./menu.controller.js";

export function createMenuController() {
    const dishRepo = new DishRepo(pool);
    const menuService = new MenuService(dishRepo);
    return new MenuController(menuService);
}
