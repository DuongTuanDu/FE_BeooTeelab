import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { formatPrice } from "../../helpers/formatPrice";
import ModalCheckOut from "../../components/Modal/ModalCheckOut";
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "../../redux/cart/cart.slice";
import { useNavigate } from "react-router-dom";
import {
    BsTrash,
    BsPlusCircle,
    BsDashCircle,
    BsShop,
    BsTruck,
    BsShieldCheck,
} from "react-icons/bs";

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, totalAmount } = useSelector((state) => state.cart.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);
    
    const [open, setOpen] = useState(false);

    const handleIncrement = (productId, size, color) => {
        dispatch(incrementQuantity({ productId, size, color }));
    };

    const handleDecrement = (productId, size, color) => {
        dispatch(decrementQuantity({ productId, size, color }));
    };

    const handleRemove = (productId, size, color) => {
        dispatch(removeFromCart({ productId, size, color }));
    };

    if (products.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
                <div className="bg-gray-50 p-8 rounded-2xl text-center max-w-md w-full">
                    <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BsShop className="text-4xl text-rose-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Giỏ hàng trống
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Hãy thêm một số sản phẩm vào giỏ hàng để bắt đầu mua sắm!
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <BsShop className="text-xl" />
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ModalCheckOut
                open={open}
                setOpen={setOpen}
                products={products}
                totalAmount={totalAmount}
            />

            <Breadcrumb className="mb-6">
                <Breadcrumb.Item>
                    <HomeOutlined /> Trang chủ
                </Breadcrumb.Item>
                <Breadcrumb.Item>Giỏ hàng</Breadcrumb.Item>
            </Breadcrumb>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-4">
                    {products.map((item) => (
                        <div
                            key={`${item.productId}-${item.size}-${item.color}`}
                            className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-4">
                                <div className="relative w-24 sm:w-32">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full aspect-square object-cover rounded-lg"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-medium text-gray-900 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                handleRemove(item.productId, item.size, item.color)
                                            }
                                            className="p-1 text-gray-400 hover:text-rose-600 transition-colors"
                                        >
                                            <BsTrash className="text-xl" />
                                        </button>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm">
                                                Size: {item.size}
                                            </span>
                                            <span className="px-2 py-1 bg-gray-100 rounded-lg text-sm">
                                                Màu: {item.color}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-rose-600">
                                                    {formatPrice(item.price)}đ
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg">
                                                <button
                                                    onClick={() =>
                                                        handleDecrement(
                                                            item.productId,
                                                            item.size,
                                                            item.color
                                                        )
                                                    }
                                                    className="text-gray-500 hover:text-rose-600 transition-colors"
                                                >
                                                    <BsDashCircle className="text-xl" />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleIncrement(
                                                            item.productId,
                                                            item.size,
                                                            item.color
                                                        )
                                                    }
                                                    className="text-gray-500 hover:text-rose-600 transition-colors"
                                                >
                                                    <BsPlusCircle className="text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
                        <h2 className="text-xl font-bold mb-6">Tổng đơn hàng</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">Tạm tính</span>
                                <span className="font-medium">{formatPrice(totalAmount)}đ</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-gray-600">Phí vận chuyển</span>
                                <span className="text-rose-600 font-medium">0đ</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Tổng tiền</span>
                                <span className="text-rose-600">
                                    {formatPrice(totalAmount)}đ
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-2 text-gray-600">
                                <BsTruck className="text-xl text-rose-600" />
                                <span className="text-sm">
                                    Miễn phí vận chuyển cho đơn từ 500K
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <BsShieldCheck className="text-xl text-rose-600" />
                                <span className="text-sm">Bảo hành sản phẩm 12 tháng</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                if (!isAuthenticated) {
                                    navigate("/auth");
                                    return;
                                }
                                setOpen(true);
                            }}
                            className="w-full bg-rose-600 text-white py-3 px-6 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Thanh toán ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;