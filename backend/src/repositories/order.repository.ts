import { Pool } from "pg";
import { DatabaseTransactionError } from "../errors/index.js";

type NewOrderUserInput = {
    type: string;
    items: {
        id: string;
        quantity: number;
    }[];
};

export class OrderRepo {
    private static instance: OrderRepo;
    private pool!: Pool;
    constructor(pool: Pool) {
        if (OrderRepo.instance) {
            return OrderRepo.instance;
        }
        this.pool = pool;
        OrderRepo.instance = this;
    }
    async calcTotalPrice(itemIdArray: string[], itemQuantityArray: number[]) {
        const total = await this.pool.query(`
            SELECT COALESCE(SUM(d.min_price * i.quantity::DOUBLE PRECISION), 0)::NUMERIC AS total_amount,
            COUNT(d.id)::INT AS found_items,
            array_length($1, 1)::INT AS requested_items
            FROM UNNEST($1::TEXT[], $2::INT[]) AS i(id, quantity)
            LEFT JOIN dishes d ON d.id = i.id;
            `, 
            [itemIdArray, itemQuantityArray]);
        
        return total;
    }
    async insertNewOrder(order: NewOrderUserInput, 
        orderOrigin: {userId: string, restaurantId: string},
        orderId: string,
        serial: number,
        totalPrice: number) {

        const client = await this.pool.connect();

        try{
            await client.query("BEGIN");

            const orderResult = await client.query(`
                INSERT INTO orders (
                    id, 
                    user_id, 
                    restaurant_id, 
                    serial, 
                    type, 
                    state, 
                    total_price
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7
                ) RETURNING id;`, [ 
                    orderId, 
                    orderOrigin.userId, 
                    orderOrigin.restaurantId,
                    serial,
                    order.type,
                    "PENDING",
                    totalPrice
                ]);

            const returnedId = orderResult.rows[0].id;

            const itemsIdArray: string[] = [];
            const itemsQuantityArray: number[] = [];
            order.items.map(item => {
                itemsIdArray.push(item.id);
                itemsQuantityArray.push(item.quantity);
            });

            const itemsResult = await client.query(`
                INSERT INTO order_items (order_id, dish_id, quantity) 
                SELECT $1::TEXT AS order_id, UNNEST($2::TEXT[]) AS dish_id, UNNEST($3::INT[]) AS quantity
                ;`, [returnedId, itemsIdArray, itemsQuantityArray]);

            await client.query("COMMIT");
            return {returnedOrderId: returnedId, success: true};
        } catch(err){
            await client.query("ROLLBACK");
            throw new DatabaseTransactionError("An error occured while proccessing your data");
        } finally {
            client.release();
        }
    }
    async updateOrderState(data: { orderId: string; newState: string }) {
        const updatedOrder = await this.pool.query(
            "UPDATE orders SET state = $1 WHERE id = $2 RETURNING state, serial;",
            [data.newState, data.orderId]
        );
        return updatedOrder;
    }
    async selectPendingOrdersOfCompany(restaurantId: string) {
        const pendingOrders = await this.pool.query(
            `
            SELECT o.id AS order_id, d.name AS dish_name, oi.quantity, o.state, o.serial 
            FROM dishes d
            JOIN order_items oi ON d.id = oi.dish_id
            JOIN orders o ON oi.order_id = o.id
            WHERE o.restaurant_id = $1 AND o.state = 'PENDING'
            ORDER BY o.created_at ASC;`,
            [restaurantId]
        );
        return pendingOrders;
    }
}

export default OrderRepo;
