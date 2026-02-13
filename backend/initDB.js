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
        seed: `INSERT INTO roles (name) SELECT * FROM UNNEST (ARRAY['MANAGER', 'KITCHEN_MONITOR', 'ORDER_MONITOR', 'KIOSK']::VARCHAR[]) as name;`
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
        seed: `SELECT NOW();`
    },
    companies: {
        create: `CREATE TABLE IF NOT EXISTS companies (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            logo TEXT DEFAULT '',
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        drop: `DROP TABLE IF EXISTS companies;`,
        seed: `SELECT NOW();`
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
        seed: `SELECT NOW();`
    }
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

const rawDishes= [
    {
    "name": "Appetizers & Soups",
    "items": [
        {
        "name": "Edamame",
        "price": 4.80,
        "prep_time": 6
        },
        {
        "name": "Miso Soup",
        "price": 3.50,
        "prep_time": 8
        },
        {
        "name": "Gyoza (6 pcs)",
        "price": 6.20,
        "prep_time": 12
        },
        {
        "name": "Agedashi Tofu",
        "price": 5.90,
        "prep_time": 10
        },
        {
        "name": "Takoyaki (6 pcs)",
        "price": 6.80,
        "prep_time": 15
        },
        {
        "name": "Seaweed Salad (Wakame)",
        "price": 4.90,
        "prep_time": 7
        },
        {
        "name": "Sunomono (Cucumber Salad)",
        "price": 5.30,
        "prep_time": 8
        }
    ]
    },
    {
    "name": "Sushi & Sashimi",
    "items": [
        {
        "name": "Maguro Nigiri - Tuna (2 pcs)",
        "price": 6.50,
        "prep_time": 5
        },
        {
        "name": "Sake Nigiri - Salmon (2 pcs)",
        "price": 5.90,
        "prep_time": 5
        },
        {
        "name": "Hamachi Nigiri - Yellowtail (2 pcs)",
        "price": 7.20,
        "prep_time": 5
        },
        {
        "name": "Unagi Nigiri - Eel (2 pcs)",
        "price": 7.80,
        "prep_time": 6
        },
        {
        "name": "Tamago Nigiri - Egg (2 pcs)",
        "price": 4.50,
        "prep_time": 5
        },
        {
        "name": "Maguro Sashimi - Tuna (6 pcs)",
        "price": 13.50,
        "prep_time": 10
        },
        {
        "name": "Sake Sashimi - Salmon (6 pcs)",
        "price": 12.80,
        "prep_time": 10
        },
        {
        "name": "Mix Sashimi (9 pcs)",
        "price": 19.90,
        "prep_time": 12
        }
    ]
    },
    {
    "name": "Rolls",
    "items": [
        {
        "name": "California Roll (8 pcs)",
        "price": 7.90,
        "prep_time": 12
        },
        {
        "name": "Spicy Tuna Roll (8 pcs)",
        "price": 8.50,
        "prep_time": 12
        },
        {
        "name": "Avocado Roll (6 pcs)",
        "price": 6.50,
        "prep_time": 10
        },
        {
        "name": "Kappa Maki - Cucumber Roll (6 pcs)",
        "price": 5.20,
        "prep_time": 8
        },
        {
        "name": "Philadelphia Roll (8 pcs)",
        "price": 8.20,
        "prep_time": 12
        },
        {
        "name": "Rainbow Roll (8 pcs)",
        "price": 11.90,
        "prep_time": 18
        },
        {
        "name": "Dragon Roll (8 pcs)",
        "price": 12.50,
        "prep_time": 20
        },
        {
        "name": "Spider Roll (Soft-shell Crab)",
        "price": 11.50,
        "prep_time": 18
        },
        {
        "name": "Volcano Roll",
        "price": 13.20,
        "prep_time": 20
        }
    ]
    },
    {
    "name": "Main Dishes & Desserts",
    "items": [
        {
        "name": "Chicken Teriyaki with Rice",
        "price": 13.90,
        "prep_time": 25
        },
        {
        "name": "Beef Teriyaki with Rice",
        "price": 16.50,
        "prep_time": 25
        },
        {
        "name": "Salmon Teriyaki",
        "price": 15.80,
        "prep_time": 22
        },
        {
        "name": "Tonkatsu (Pork Cutlet)",
        "price": 14.50,
        "prep_time": 25
        },
        {
        "name": "Vegetable Tempura Set",
        "price": 11.90,
        "prep_time": 20
        },
        {
        "name": "Shrimp Tempura Udon",
        "price": 13.20,
        "prep_time": 25
        },
        {
        "name": "Mochi Ice Cream (2 pcs)",
        "price": 5.50,
        "prep_time": 5
        },
        {
        "name": "Green Tea Cheesecake",
        "price": 6.20,
        "prep_time": 8
        }
    ]
    },
    {
    "name": "Teas",
    "items": [
        {
        "name": "Sencha (Green Tea)",
        "price": 3.20,
        "prep_time": 4
        },
        {
        "name": "Gyokuro (Premium Shaded Green Tea)",
        "price": 5.80,
        "prep_time": 5
        },
        {
        "name": "Matcha (Ceremonial Grade Powdered Green Tea)",
        "price": 4.90,
        "prep_time": 6
        },
        {
        "name": "Hojicha (Roasted Green Tea)",
        "price": 3.50,
        "prep_time": 4
        },
        {
        "name": "Genmaicha (Green Tea with Roasted Rice)",
        "price": 3.80,
        "prep_time": 4
        },
        {
        "name": "Kukicha (Twig Tea)",
        "price": 3.90,
        "prep_time": 5
        },
        {
        "name": "Bancha (Coarse Leaf Green Tea)",
        "price": 3.00,
        "prep_time": 4
        },
        {
        "name": "Kabusecha (Lightly Shaded Sencha)",
        "price": 4.50,
        "prep_time": 5
        },
        {
        "name": "Fukamushicha (Deep-Steamed Sencha)",
        "price": 4.20,
        "prep_time": 4
        },
        {
        "name": "Mugicha (Roasted Barley Tea - Caffeine-free)",
        "price": 2.80,
        "prep_time": 6
        },
        {
        "name": "Shincha (First Flush Sencha - Seasonal)",
        "price": 5.50,
        "prep_time": 4
        }
    ]
    }
]

async function seedDishes(){
    const dishIDArray = [];
    const dishNameArray = [];
    const dishCategoryArray = [];
    const dishMinPriceInFloatArray = [];
    const dishPrepTimeArray = [];
    const dishCompIDArray = [];
    for(let i = 0; i < rawDishes.length; i++){
        for(let j = 0; j < rawDishes[i].items.length; j++){
            const dishIDCompanyPrefix = "veih";
            const dishIDCategoryPrefix = rawDishes[i].name.toLowerCase().replaceAll(" ", "").substring(0, 3);
            const dishIDBody = rawDishes[i].items[j].name.toLowerCase().replaceAll(" ","").substring(0, 3);
            const randomIDPostfix = crypto.randomBytes(4).toString("hex");
            
            dishIDArray.push( dishIDCompanyPrefix + "_" + dishIDCategoryPrefix + "_" + dishIDBody + "_" + randomIDPostfix);
            dishNameArray.push(rawDishes[i].items[j].name);
            dishCategoryArray.push(rawDishes[i].name);
            dishMinPriceInFloatArray.push(rawDishes[i].items[j].price);
            dishPrepTimeArray.push(rawDishes[i].items[j].prep_time);
            dishCompIDArray.push('102f6b03-945d-49ef-a561-8c7cf1fbd55b');
        }
    }
    console.log(dishIDArray)
    console.log(dishNameArray)
    console.log(dishCategoryArray)
    console.log(dishMinPriceInFloatArray)
    console.log(dishPrepTimeArray)
    const result = await pool.query(`INSERT INTO dishes (id, company_id, name, category, min_price, estimated_prep_minutes)
        SELECT * FROM UNNEST ($1::TEXT[], $2::UUID[], $3::VARCHAR[], $4::VARCHAR[], $5::DOUBLE PRECISION[], $6::SMALLINT[]);`
    ,[dishIDArray, dishCompIDArray, dishNameArray, dishCategoryArray, dishMinPriceInFloatArray, dishPrepTimeArray]);
    console.log(result);
}
//seedDishes();