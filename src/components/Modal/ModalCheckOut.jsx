import React, { useEffect, useState } from "react";
import { Collapse, Modal, Select } from "antd";
import { formatPrice } from "../../helpers/formatPrice";
import useScreen from "../../hook/useScreen";
import { useDispatch, useSelector } from "react-redux";
import { getDistrict, getProvince, getWard } from "../../redux/ship/ship.thunk";
import {
    orderCod,
    orderStripe,
    orderVnpay,
} from "../../redux/order/order.thunk";
import { FaCreditCard } from "react-icons/fa";
import { SiStripe } from "react-icons/si";
import { GiTakeMyMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { setOrderReturn } from "../../redux/order/order.slice";
import { loadStripe } from "@stripe/stripe-js";
import { clearCart } from "../../redux/cart/cart.slice";
import { validateForm, validateOrderSchema } from "../../validate/validate";
import ErrorValidate from "../Notification/ErrorValidate";
import { setDistrict, setWard } from "../../redux/ship/ship.slice";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY;
const STYLE_INPUT =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
const STYLE_LABEL = "block text-sm font-medium text-gray-700";

const ModalCheckOut = ({ open, setOpen, products = [], totalAmount = 0 }) => {
    const navigate = useNavigate();
    const { isMobile } = useScreen();
    const dispatch = useDispatch();
    const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
    const { provinces, districts, wards } = useSelector((state) => state.ship);

    const [order, setOrder] = useState({
        name: userInfo?.name || "",
        products:
            products?.map((item) => ({
                productId: item.productId,
                name: item.name,
                image: item.image,
                size: item.size,
                color: item.color,
                price: item.price,
                quantity: item.quantity,
            })) || [],
        phone: "",
        address: "",
        province: { id: "", name: "" },
        district: { id: "", name: "" },
        ward: { id: "", name: "" },
        note: "",
        paymentMethod: "COD",
        totalAmount,
    });
    const [validates, setValidates] = useState({});

    useEffect(() => {
        dispatch(getProvince());
    }, []);

    useEffect(() => {
        if (order.province.id) {
            dispatch(getDistrict(order.province.id));
        }
    }, [order.province.id]);

    useEffect(() => {
        if (order.district.id) {
            dispatch(getWard(order.district.id));
        }
    }, [order.district.id]);

    const handleChangeOrder = (key, value) => {
        setOrder((prev) => ({ ...prev, [key]: value }));
    };

    const clearOrder = () => {
        setOrder((prev) => ({
            ...prev,
            name: "",
            products:
                products?.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    image: item.image,
                    size: item.size,
                    color: item.color,
                    price: item.price,
                    quantity: item.quantity,
                })) || [],
            phone: "",
            address: "",
            province: { id: "", name: "" },
            district: { id: "", name: "" },
            ward: { id: "", name: "" },
            note: "",
            paymentMethod: "COD",
            totalAmount,
        }));
        setValidates({});
        dispatch(setDistrict([]));
        dispatch(setWard([]));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            navigate("/auth");
            return;
        }
        const validationErrors = await validateForm({
            input: order,
            validateSchema: validateOrderSchema,
        });
        if (Object.keys(validationErrors).length > 0) {
            setValidates(validationErrors);
            return;
        }
        switch (order.paymentMethod) {
            case "COD":
                return dispatch(orderCod(order)).then((res) => {
                    if (res.payload.success) {
                        dispatch(clearCart());
                        navigate(`/order-return`);
                        dispatch(setOrderReturn(res.payload.data));
                    }
                });
            case "VNPAY":
                return dispatch(orderVnpay(order)).then((res) => {
                    if (res.payload.success) {
                        window.location.href = res.payload.data;
                    }
                });
            case "STRIPE":
                const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
                dispatch(orderStripe(order)).then(async (res) => {
                    if (res.payload.success) {
                        await stripe.redirectToCheckout({
                            sessionId: res.payload.id,
                        });
                    }
                });
                break;
            default:
                break;
        }
    };

    const CartOrder = () => (
        <div className="w-full my-4 max-h-[60vh] overflow-y-auto pr-2 space-y-4">
            {products.map((item, index) => (
                <div
                    key={`cart-item-modal-${index}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-4"
                >
                    <div className="flex items-center space-x-4">
                        <div className="relative flex-shrink-0">
                            <img
                                className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md"
                                src={item?.image}
                                alt={item.name}
                            />
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                x{item.quantity}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                                {item.name}
                            </h3>
                            <div className="mt-1 flex items-center text-xs md:text-sm text-gray-600">
                                <span className="bg-gray-100 px-2 py-1 rounded-full mr-2">
                                    {item.size}
                                </span>
                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                    {item.color}
                                </span>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-500">
                                    Đơn giá: {formatPrice(item.price)}đ
                                </span>
                                <span className="text-sm md:text-base font-bold text-rose-800">
                                    {formatPrice(item.quantity * item.price)}đ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Modal
            className="px-2"
            width={isMobile ? "100%" : "850px"}
            open={open}
            title="Thông tin đặt hàng"
            onCancel={() => {
                setOpen(false);
                clearOrder();
            }}
            footer={[
                <button
                    key="cancel"
                    onClick={() => {
                        setOpen(false);
                        clearOrder();
                    }}
                    className="bg-white border-slate-500 border px-4 py-2 mx-2 rounded-md"
                >
                    Hủy
                </button>,
                <button
                    key="order"
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-slate-950 text-slate-50 px-4 py-2 ml-2 rounded-md"
                >
                    Đặt hàng
                </button>,
            ]}
        >
            <Collapse
                items={[
                    {
                        key: "1",
                        label: `Đơn hàng (${products.length} sản phẩm)`,
                        children: <CartOrder />,
                    },
                ]}
            />
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={STYLE_LABEL}>Họ tên:</label>
                        <input
                            type="text"
                            className={`${STYLE_INPUT} ${validates.name ? "border-red-500" : ""
                                }`}
                            value={order.name}
                            onFocus={() => setValidates((prev) => ({ ...prev, name: "" }))}
                            onChange={(e) => handleChangeOrder("name", e.target.value)}
                        />
                        {validates.name ? <ErrorValidate message={validates.name} /> : ""}
                    </div>
                    <div>
                        <label className={STYLE_LABEL}>Số điện thoại:</label>
                        <input
                            type="tel"
                            className={`${STYLE_INPUT} ${validates.phone ? "border-red-500" : ""
                                }`}
                            value={order.phone}
                            onFocus={() => setValidates((prev) => ({ ...prev, phone: "" }))}
                            onChange={(e) => handleChangeOrder("phone", e.target.value)}
                        />
                        {validates.phone ? <ErrorValidate message={validates.phone} /> : ""}
                    </div>
                </div>
                <div className="mt-4">
                    <label className={STYLE_LABEL}>Tỉnh thành:</label>
                    <Select
                        value={order.province.id || undefined}
                        onChange={(value) => {
                            const selected = provinces?.find(
                                (p) => p.ProvinceID === parseInt(value)
                            );
                            if (selected) {
                                handleChangeOrder("province", {
                                    id: selected.ProvinceID,
                                    name: selected.ProvinceName,
                                });
                                handleChangeOrder("district", { id: "", name: "" });
                                handleChangeOrder("ward", { id: "", name: "" });
                            }
                        }}
                        onFocus={() =>
                            setValidates((prev) => ({ ...prev, ["province.id"]: "" }))
                        }
                        className={validates["province.id"] ? "border-red-500" : ""}
                        placeholder="Chọn tỉnh thành"
                        style={{ width: '100%' }}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase())
                        }
                        optionFilterProp="children"
                    >
                        {provinces?.map((item) => (
                            <Select.Option key={item.ProvinceID} value={item.ProvinceID}>
                                {item.ProvinceName}
                            </Select.Option>
                        ))}
                    </Select>
                    {validates["province.id"] ? (
                        <ErrorValidate message={validates["province.id"]} />
                    ) : (
                        ""
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className={STYLE_LABEL}>Quận huyện:</label>
                        <Select
                            disabled={districts?.length === 0}
                            value={order.district.id || undefined}
                            onChange={(value) => {
                                const selected = districts?.find(
                                    (d) => d.DistrictID === parseInt(value)
                                );
                                if (selected) {
                                    handleChangeOrder("district", {
                                        id: selected.DistrictID,
                                        name: selected.DistrictName,
                                    });
                                    handleChangeOrder("ward", { id: "", name: "" });
                                }
                            }}
                            onFocus={() =>
                                setValidates((prev) => ({ ...prev, ["district.id"]: "" }))
                            }
                            className={validates["district.id"] ? "border-red-500" : ""}
                            placeholder="Chọn quận huyện"
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="children"
                        >
                            {districts?.map((item) => (
                                <Select.Option key={item.DistrictID} value={item.DistrictID}>
                                    {item.DistrictName}
                                </Select.Option>
                            ))}
                        </Select>
                        {validates["district.id"] ? (
                            <ErrorValidate message={validates["district.id"]} />
                        ) : (
                            ""
                        )}
                    </div>
                    <div>
                        <label className={STYLE_LABEL}>Phường xã:</label>
                        <Select
                            disabled={wards?.length === 0}
                            value={order.ward.id || undefined}
                            onChange={(value) => {
                                const selected = wards?.find(
                                    (w) => w.WardCode === value
                                );
                                if (selected) {
                                    handleChangeOrder("ward", {
                                        id: selected.WardCode,
                                        name: selected.WardName,
                                    });
                                }
                            }}
                            onFocus={() =>
                                setValidates((prev) => ({ ...prev, ["ward.id"]: "" }))
                            }
                            className={validates["ward.id"] ? "border-red-500" : ""}
                            placeholder="Chọn phường xã"
                            style={{ width: '100%' }}
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            optionFilterProp="children"
                        >
                            {wards?.map((item) => (
                                <Select.Option key={item.WardCode} value={item.WardCode}>
                                    {item.WardName}
                                </Select.Option>
                            ))}
                        </Select>
                        {validates["ward.id"] ? (
                            <ErrorValidate message={validates["ward.id"]} />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <label className={STYLE_LABEL}>Địa chỉ:</label>
                    <input
                        type="text"
                        className={`${STYLE_INPUT} ${validates.address ? "border-red-500" : ""
                            }`}
                        value={order.address}
                        onFocus={() => setValidates((prev) => ({ ...prev, address: "" }))}
                        onChange={(e) => handleChangeOrder("address", e.target.value)}
                    />
                    {validates.address ? (
                        <ErrorValidate message={validates.address} />
                    ) : (
                        ""
                    )}
                </div>
                <div className="mt-4">
                    <label className={STYLE_LABEL}>Ghi chú (nếu có):</label>
                    <textarea
                        className={STYLE_INPUT}
                        rows="3"
                        value={order.note}
                        onChange={(e) => handleChangeOrder("note", e.target.value)}
                    ></textarea>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Phương thức thanh toán:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${order.paymentMethod === "COD"
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-300 hover:border-indigo-300"
                                }`}
                            onClick={() => handleChangeOrder("paymentMethod", "COD")}
                        >
                            <div className="flex items-center">
                                <input
                                    id="cod"
                                    name="paymentMethod"
                                    type="radio"
                                    checked={order.paymentMethod === "COD"}
                                    onChange={() => handleChangeOrder("paymentMethod", "COD")}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="cod"
                                    className="ml-3 flex items-center cursor-pointer"
                                >
                                    <GiTakeMyMoney className="text-2xl mr-2 text-[#19c37d]" />
                                    <span className="font-medium text-gray-900">
                                        Thanh toán COD
                                    </span>
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 ml-8">
                                Thanh toán khi nhận được hàng
                            </p>
                        </div>

                        <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${order.paymentMethod === "VNPAY"
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-300 hover:border-indigo-300"
                                }`}
                            onClick={() => handleChangeOrder("paymentMethod", "VNPAY")}
                        >
                            <div className="flex items-center">
                                <input
                                    id="vnpay"
                                    name="paymentMethod"
                                    type="radio"
                                    checked={order.paymentMethod === "VNPAY"}
                                    onChange={() => handleChangeOrder("paymentMethod", "VNPAY")}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="vnpay"
                                    className="ml-3 flex items-center cursor-pointer"
                                >
                                    <FaCreditCard className="text-xl mr-2 text-blue-600" />
                                    <span className="font-medium text-gray-900">
                                        Thanh toán qua VNPay
                                    </span>
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 ml-8">
                                Thanh toán an toàn và nhanh chóng với VNPay
                            </p>
                        </div>

                        <div
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${order.paymentMethod === "STRIPE"
                                ? "border-indigo-500 bg-indigo-50"
                                : "border-gray-300 hover:border-indigo-300"
                                }`}
                            onClick={() => handleChangeOrder("paymentMethod", "STRIPE")}
                        >
                            <div className="flex items-center">
                                <input
                                    id="stripe"
                                    name="paymentMethod"
                                    type="radio"
                                    checked={order.paymentMethod === "STRIPE"}
                                    onChange={() => handleChangeOrder("paymentMethod", "STRIPE")}
                                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="stripe"
                                    className="ml-3 flex items-center cursor-pointer"
                                >
                                    <SiStripe className="text-xl mr-2 text-purple-600" />
                                    <span className="font-medium text-gray-900">
                                        Thanh toán qua Stripe
                                    </span>
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 ml-8">
                                Thanh toán an toàn với Stripe, hỗ trợ nhiều loại thẻ
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 font-bold flex justify-between items-center">
                    <span className="text-lg">Tổng tiền:</span>
                    <span className="text-rose-800 text-xl">
                        {formatPrice(totalAmount)}đ
                    </span>
                </div>
            </form>
        </Modal>
    );
};

export default ModalCheckOut;