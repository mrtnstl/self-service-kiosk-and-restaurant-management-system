import { Pool } from "pg";
import config from "../config/index.js";

if (!config.DATABASE_CONNECTION_STRING) {
    throw new Error("DATABASE_CONNECTION_STRING in undefined!");
}

const pool = new Pool({
    connectionString: config.DATABASE_CONNECTION_STRING,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

pool.on("error", (err, _client) => {
    console.error("Database Error:", err);
    process.exit(-1);
});

export async function testDBConn() {
    const isAlive = (await pool.query("SELECT true as isAlive;")).rows[0]
        .isalive;
    console.log("is db alive:", isAlive);
}

export default pool;
