import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(
        (item) => item.crop._id === action.payload.crop._id
      );

      if (existing) {
        existing.quantity += 1; // ✅ increase qty
      } else {
        state.items.push(action.payload); // ✅ add new
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.crop._id !== action.payload
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
    increaseQty: (state, action) => {
  const item = state.items.find(
    (i) => i.crop._id === action.payload
  );
  if (item) item.quantity += 1;
},

decreaseQty: (state, action) => {
  const item = state.items.find(
    (i) => i.crop._id === action.payload
  );
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  }
},



  },
});

export const { addToCart,increaseQty,
  decreaseQty, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;