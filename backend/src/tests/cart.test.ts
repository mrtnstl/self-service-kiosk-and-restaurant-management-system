import { calculateTotalPrice, Product } from "../cart";

it("should calculate total price", () => {
    const cart: Product[] = [
        { id: 1, name: "Sushi1", price: 39, quantity: 1 },
        { id: 2, name: "Sushi2", price: 19, quantity: 2 },
        { id: 3, name: "Chopsticks", price: 2, quantity: 1 },
    ];

    const totalPrice = calculateTotalPrice(cart);
    expect(totalPrice).toBe(1400);
});
