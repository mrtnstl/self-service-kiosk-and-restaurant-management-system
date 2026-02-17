import { configureStore } from "@reduxjs/toolkit";
import { CartSlice } from "./slices/CartSlice";
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import { OrderTypeSlice } from "./slices/OrderTypeSlice";

const store = configureStore({
    reducer: {
        cart: CartSlice.reducer,
        orderType: OrderTypeSlice.reducer,
    }
});

export default store;

export const useAppDispatch: ()=>typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;