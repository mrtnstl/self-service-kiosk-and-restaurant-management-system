import { createSlice, type Slice, type SliceSelectors } from "@reduxjs/toolkit";
import { type PayloadAction } from "@reduxjs/toolkit";
export interface CartItem {
    id: string;
    quantity: number;
    name: string;
    price: number;
};
interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: []
};

export const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<{id: string, name: string, price: number}>)=>{
            const isAdded = state.items.find(item => item.id === action.payload.id);
            isAdded ? isAdded.quantity++ : state.items.push({...action.payload, quantity: 1});
        },
        removeItem: (state, action: PayloadAction<{id: string}>) => {
            state.items = state.items.filter(item => (item.id !== action.payload.id));
        },
        updateQuantity: (state, action: PayloadAction<{id: string, quantity: number}>) => {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if(existingItem){ 
                existingItem.quantity = action.payload.quantity;
            }
        },
        clearItems: (state, _action: PayloadAction) => {
            state.items = initialState.items;
        }
    }
});

export const {addItem, removeItem, updateQuantity, clearItems} = CartSlice.actions;
