import { RequestHandler } from "express";

interface RestaurantController {
    objectRepo: {};
    // menu handlers
    // restaurant handlers
}
class RestaurantController {
    constructor(objectRepo: {}) {
        this.objectRepo = objectRepo;
    }
    getRestaurantData(): RequestHandler {
        return async (_req, res) => {
            return res.status(200).json({ message: "hello from res" });
        };
    }
}

export default RestaurantController;
