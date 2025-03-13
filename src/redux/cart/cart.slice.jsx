import { createSlice } from "@reduxjs/toolkit";
import { get, set } from "../../storage/storage";

const initialState = {
  cart: get("cart") || {
    products: [],
    totalAmount: 0,
  },
};

const calculateTotalAmount = (products) => {
  return products.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.cart.products.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.color === newItem.color
      );

      if (existingItemIndex !== -1) {
        state.cart.products[existingItemIndex].quantity += 1;
      } else {
        state.cart.products.push({
          productId: newItem.productId,
          name: newItem.name,
          image: newItem.image,
          size: newItem.size,
          color: newItem.color,
          price: newItem.price,
          quantity: 1,
        });
      }
      state.cart.totalAmount = calculateTotalAmount(state.cart.products);
      set("cart", state.cart);
    },
  },
});
export const {
  addToCart,
} = cartSlice.actions;
export default cartSlice.reducer;