import config from "../../config/index.js";

function genOrderId(
    companyId: string,
    userId: string,
    restaurantId: string
): string {
    const companyPrefix = companyId.slice(0, 3);
    const restaurantPrefix = restaurantId.slice(0, 3);
    const userPrefix = userId.slice(0, 3);
    const now = Date.now();
    return `${companyPrefix}_${restaurantPrefix}_${userPrefix}_${now}`;
}

function createCounter() {
    const initial = config.ORDER_SERIAL_INITIAL;
    let idx = initial;
    return () => {
        idx++;
        return idx;
    };
}
const getNextSerial = createCounter();

export interface IOrderHelpers {
    genOrderId: typeof genOrderId;
    getNextSerial: typeof getNextSerial;
}

const orderHelpers: IOrderHelpers = {
    genOrderId,
    getNextSerial,
};

export default orderHelpers;
