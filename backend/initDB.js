import fs from "node:fs";
import { Pool } from "pg";
import crypto from "node:crypto";

if (!process.env.DATABASE_CONNECTION_STRING) {
    throw new Error("DATABASE_CONNECTION_STRING in undefined!");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTION_STRING,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

//
(async () => {
    try {
        const client = await pool.connect();
        const { rows } = await client.query("SELECT version();");
        console.log(rows[0]);
        client.release();
    } catch (err) {
        console.error("Database Error:", err);
    }
})();

/**
 * roles (KIOSK, ORDER_MONITOR, KITCHEN_MONITOR, MANAGER)
 */

const tables = {
    roles: {
        create: `CREATE TABLE IF NOT EXISTS roles (
            id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(20) NOT NULL
        );`,
        drop: `DROP TABLE IF EXISTS roles;`,
        seed: `INSERT INTO roles (name) SELECT * FROM UNNEST (ARRAY['MANAGER', 'KITCHEN_MONITOR', 'ORDER_MONITOR', 'KIOSK']::VARCHAR[]) as name;`,
    },
    users: {
        create: `CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            company_id UUID, -- NOT NULL
            restaurant_id UUID,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) DEFAULT '', --managers only
            role_id INT DEFAULT NULL,
            pw_hash TEXT NOT NULL,
            pw_salt TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        drop: `DROP TABLE IF EXISTS users;`,
        seed: `SELECT NOW();`,
    },
    companies: {
        create: `CREATE TABLE IF NOT EXISTS companies (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            logo TEXT DEFAULT '',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        drop: `DROP TABLE IF EXISTS companies;`,
        seed: `SELECT NOW();`,
    },
    dishes: {
        create: `CREATE TABLE IF NOT EXISTS dishes (
            id TEXT PRIMARY KEY, -- generated based on dish name and random numbers
            company_id UUID NOT NULL,
            name VARCHAR(100) NOT NULL,
            category VARCHAR(30) NOT NULL,
            min_price DOUBLE PRECISION NOT NULL,
            estimated_prep_minutes SMALLINT NOT NULL
        )`,
        drop: `DROP TABLE IS EXISTS dishes`,
        seed: `SELECT NOW();`,
    },
};

//execute(tables, "create");

async function execute(tables, action) {
    if (typeof action === "undefined") {
        console.error("'action' is undefined.");
        process.exit(1);
    }
    try {
        for (const key in tables) {
            console.log(tables[key][action]);
            await pool.query(tables[key][action]);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
const rawDishes = JSON.parse(fs.readFileSync("./sushi_menu.json")).menu.categories;

async function seedDishes() {
    const dishIDArray = [];
    const dishNameArray = [];
    const dishCategoryArray = [];
    const dishMinPriceInFloatArray = [];
    const dishPrepTimeArray = [];
    const dishCompIDArray = [];
    for (let i = 0; i < rawDishes.length; i++) {
        for (let j = 0; j < rawDishes[i].items.length; j++) {
            const dishIDCompanyPrefix = "veih";
            const dishIDCategoryPrefix = rawDishes[i].name
                .toLowerCase()
                .replaceAll(" ", "")
                .substring(0, 3);
            const dishIDBody = rawDishes[i].items[j].name
                .toLowerCase()
                .replaceAll(" ", "")
                .substring(0, 3);
            const randomIDPostfix = crypto.randomBytes(4).toString("hex");

            dishIDArray.push(
                dishIDCompanyPrefix +
                    "_" +
                    dishIDCategoryPrefix +
                    "_" +
                    dishIDBody +
                    "_" +
                    randomIDPostfix
            );
            dishNameArray.push(rawDishes[i].items[j].name);
            dishCategoryArray.push(rawDishes[i].name);
            dishMinPriceInFloatArray.push(rawDishes[i].items[j].price);
            dishPrepTimeArray.push(rawDishes[i].items[j].prep_time);
            dishCompIDArray.push("102f6b03-945d-49ef-a561-8c7cf1fbd55b");
        }
    }

    const result = await pool.query(
        `INSERT INTO dishes (id, company_id, name, category, min_price, estimated_prep_minutes)
        SELECT * FROM UNNEST ($1::TEXT[], $2::UUID[], $3::VARCHAR[], $4::VARCHAR[], $5::DOUBLE PRECISION[], $6::SMALLINT[]);`,
        [
            dishIDArray,
            dishCompIDArray,
            dishNameArray,
            dishCategoryArray,
            dishMinPriceInFloatArray,
            dishPrepTimeArray,
        ]
    );
    console.log(result);
}
//seedDishes();
