import { Pool } from "pg";

export class DishRepo {
    private static instance: DishRepo;
    private pool!: Pool;
    constructor(pool: Pool) {
        if (DishRepo.instance) {
            return DishRepo.instance;
        }
        this.pool = pool;
        DishRepo.instance = this;
    }

    async selectAllDishOfCompany(companyId: string) {
        const result = await this.pool.query(
            "SELECT id, name, category, min_price, estimated_prep_minutes FROM dishes WHERE company_id = $1;",
            [companyId]
        );
        return result;
    }
}

export default DishRepo;
