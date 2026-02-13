import { Pool } from "pg";

if(!process.env.DATABASE_CONNECTION_STRING){
    throw new Error("DATABASE_CONNECTION_STRING in undefined!");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_CONNECTION_STRING,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
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


const tables = {
    roles: {
        create: `CREATE TABLE IF NOT EXISTS roles (
            id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            name VARCHAR(20) NOT NULL
        );`,
        drop: `DROP TABLE IF EXISTS roles;`
    },
    users: {
        create: `CREATE TABLE IF NOT EXISTS users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            company_id UUID,
            restaurant_id UUID,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100), --managers only
            role_id INT,
            pw_hash TEXT NOT NULL,
            pw_salt TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
        drop: `DROP TABLE IF EXISTS users;`
    }
}

execute(tables, "create")

async function execute(tables, action){
    if(typeof action === "undefined"){
        console.error("'action' is undefined.");
        process.exit(1);
    }
    try {
        for (const key in tables) {
            console.log(tables[key][action]);
            await pool.query(tables[key][action]);
        }
    } catch(err){
        console.error(err);
        process.exit(1);
    }
}