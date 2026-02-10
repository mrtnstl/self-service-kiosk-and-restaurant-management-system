import config from "./config/index.js";
import express from "express";
import { calculateTotalPrice, Product } from "./cart.js";

const app = express();

const PORT = config.PORT;

const cart: Product[] = [
  { id: 1, name: "Sushi1", price: 39, quantity: 1 },
  { id: 2, name: "Sushi2", price: 19, quantity: 2 },
  { id: 3, name: "Chopsticks", price: 2, quantity: 1 },
];

console.log("Total Price:", calculateTotalPrice(cart));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));