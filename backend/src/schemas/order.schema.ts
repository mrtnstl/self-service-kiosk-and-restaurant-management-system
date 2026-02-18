import * as z from "zod";

export const newOrderSchema = z.object({
    type: z.string(),
    items: z.array(
        z.object({
            id: z.string(),
            quantity: z.number(),
        })
    ),
});

export const changeOrderStateSchema = z.object({
    orderId: z.string(),
    newState: z.string(),
});

export interface IOrderSchema {
    newOrderSchema: typeof newOrderSchema;
    changeOrderStateSchema: typeof changeOrderStateSchema;
}

const orderSchemas: IOrderSchema = {
    newOrderSchema,
    changeOrderStateSchema,
};

export default orderSchemas;
