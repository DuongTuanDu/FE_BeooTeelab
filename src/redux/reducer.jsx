import authReducer from "./auth/auth.slice";
import statisticalReducer from "./statistical/statistical.slice";
import orderReducer from "./order/order.slice";
import userReducer from "./user/user.slice";
import productReducer from "./product/product.slice";
import categoryReducer from "./category/category.slice";

const reducer = {
    auth: authReducer,
    statistical: statisticalReducer,
    order: orderReducer,
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
};

export default reducer;