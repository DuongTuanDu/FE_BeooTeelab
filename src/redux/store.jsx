import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

const rootReducer = {
  ...reducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});