import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import { promotionApi } from "./promotion/promotion.query";
import { productApi } from "./product/product.query";
import { categoryApi } from "./category/category.query";

const rootReducer = {
  ...reducer,
  [promotionApi.reducerPath]: promotionApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat( promotionApi.middleware, productApi.middleware, categoryApi.middleware ),
});