import config from "./config/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import gracefulShutdown from "./utils/gracefulShutdown.js";
import { testDBConn } from "./utils/database.js";
import { initRoutes } from "./routes/index.js";

const app = express();

const PORT = config.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors(config.CORS_OPTIONS));

(async () => {
    await testDBConn();
})();

initRoutes(app);

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

process.on("SIGINT", async eventName => {
    await gracefulShutdown(eventName, server);
});
process.on("SIGTERM", async eventName => {
    await gracefulShutdown(eventName, server);
});
