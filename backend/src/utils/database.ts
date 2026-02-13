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

export default pool;
