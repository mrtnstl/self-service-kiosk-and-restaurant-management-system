import * as z from "zod";

export const newCompanySchema = z.object({
    name: z.string(),
    logoUrl: z.string(),
});

export interface CompanySchemasInterf {
    newCompanySchema: z.ZodObject<
        {
            name: z.ZodString;
            logoUrl: z.ZodString;
        },
        z.core.$strip
    >;
}
const companySchemas: CompanySchemasInterf = {
    newCompanySchema: newCompanySchema,
};
export default companySchemas;
