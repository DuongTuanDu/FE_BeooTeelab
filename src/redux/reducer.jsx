import authReducer from "./auth/auth.slice";
import statisticalReducer from "./statistical/statistical.slice";
import orderReducer from "./order/order.slice";
import userReducer from "./user/user.slice";
import productReducer from "./product/product.slice";
import categoryReducer from "./category/category.slice";
import reviewReducer from "./review/review.slice";
import promotionReducer from "./promotion/promotion.slice";
import cartReducer from "./cart/cart.slice";
import shipReducer from "./ship/ship.slice";

const reducer = {
    auth: authReducer,
    statistical: statisticalReducer,
    order: orderReducer,
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    review: reviewReducer,
    promotion: promotionReducer,
    cart: cartReducer,
    ship: shipReducer,
};

export default reducer;