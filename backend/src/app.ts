import config from "./config/index.js";
import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import gracefulShutdown from "./utils/gracefulShutdown.js";
import { initRoutes } from "./routes/index.js";

//import { calculateTotalPrice, Product } from "./cart.js";

const app = express();

const PORT = config.PORT;

app.use(express.json());
app.use(cookieParser());

/*
const cart: Product[] = [
  { id: 1, name: "Sushi1", price: 39, quantity: 1 },
  { id: 2, name: "Sushi2", price: 19, quantity: 2 },
  { id: 3, name: "Chopsticks", price: 2, quantity: 1 },
];
console.log("Total Price:", calculateTotalPrice(cart));
*/

initRoutes(app);

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

process.on("SIGINT", async eventName => {
    await gracefulShutdown(eventName, server);
});
process.on("SIGTERM", async eventName => {
    await gracefulShutdown(eventName, server);
});
