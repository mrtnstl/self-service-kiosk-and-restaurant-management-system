import { Pool } from "pg";
import config from "../../config/index.js";
import logger from "../../utils/logger.js";

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
    logger.error(`database error: ${err.message}`);
    process.exit(1);
});

pool.on("connect", ()=>{
    logger.info("database client connected");
});

export async function isDBAlive(): Promise<boolean>{
    const res = (await pool.query("SELECT 1;")).rows[0];
    return res === 1 ? true : false;
}

export async function closeDatabaseConn() {
    if(await isDBAlive() === true){
        await pool.end();
    }
}

export default pool;
