import { InternalServerError, NotFoundError } from "../errors/index.js";
import { IOrderHelpers } from "../helpers/order.helpers.js";
import OrderRepo from "../repositories/order.repository.js";

export class OrderService {
    private static instance: OrderService;
    private orderRepo!: OrderRepo;
    private orderHelpers!: IOrderHelpers;
    constructor(orderRepo: OrderRepo, orderHelpers: IOrderHelpers) {
        if (OrderService.instance) {
            return OrderService.instance;
        }
        this.orderRepo = orderRepo;
        this.orderHelpers = orderHelpers;
        OrderService.instance = this;
    }
    async createNewOrder(order: {
        type: string;
        items: {
            id: string;
            quantity: number;
        }[];
    }, orderOrigin: {userId: string, restaurantId: string, companyId: string}) {
        const orderId: string = this.orderHelpers.genOrderId(orderOrigin.companyId, orderOrigin.userId, orderOrigin.restaurantId);
        const serial: number = this.orderHelpers.getNextSerial();

        const itemIdArray: string[] = [];
        const itemQuantityArray: number[] = [];
        order.items.map(item=>{
            itemIdArray.push(item.id);
            itemQuantityArray.push(item.quantity);
        });

        const sumResult = await this.orderRepo.calcTotalPrice(itemIdArray, itemQuantityArray);
        if(sumResult.rows[0].found_items !== sumResult.rows[0].requested_items){
            throw new Error(
                `Some items can not be found during the calculation (${sumResult.rows[0].found_items}/${sumResult.rows[0].requested_items})`
            );
        }

        try {
            const insertedOrder = await this.orderRepo.insertNewOrder(order, orderOrigin, orderId, serial, sumResult.rows[0].total_amount);
            if(!insertedOrder.success){
                throw new Error("Failed creating order");
            }
    
            // TODO: emit order_new event for sse
    
            return {serial: serial, totalPrice: sumResult.rows[0].total_amount};
        } catch(err: any){
            throw new Error(err.message);
        }
    }
    async changeOrderState(data: { orderId: string; newState: string }) {
        const update = await this.orderRepo.updateOrderState(data);
        if (update.rowCount === 0) {
            throw new NotFoundError("Order requiring update not found");
        }
        if (update.rowCount! > 1) {
            throw new InternalServerError(
                "Multiple order went through state change"
            );
        }
        return {
            orderSerial: update.rows[1].serial,
            newSatte: update.rows[1].state,
        };
    }
    async getPendingOrders(restaurantId: string) {}
}

export default OrderService;
