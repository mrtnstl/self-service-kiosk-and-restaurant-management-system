import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type OrderTypes = "togo" | "local" | "";

interface OrderTypeState {
    orderType: OrderTypes;
}

const initialState: OrderTypeState = {
    orderType: ""
}

export const OrderTypeSlice = createSlice({
    name:"orderType",
    initialState,
    reducers: {
        setOrderType: (state, action: PayloadAction<OrderTypes>) =>{
            state.orderType = action.payload;
        },
        resetOrderType: (state, _action: PayloadAction)=>{
            state.orderType = initialState.orderType;
        }
    }
});

export const {setOrderType, resetOrderType} = OrderTypeSlice.actions;