import * as z from "zod";

export const newRestaurantSchema = z.object({
    companyId: z.string(),
    name: z.string(),
    location: z.string(),
});

export interface RestaurantSchemasInterf {
    newRestaurantSchema: z.ZodObject<
        {
            companyId: z.ZodString;
            name: z.ZodString;
            location: z.ZodString;
        },
        z.core.$strip
    >;
}
const restaurantSchemas: RestaurantSchemasInterf = {
    newRestaurantSchema: newRestaurantSchema,
};
export default restaurantSchemas;
