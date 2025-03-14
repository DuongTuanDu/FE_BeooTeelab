import React, { useEffect, useState } from "react";
import { Result, Button, Typography, Divider, Timeline } from "antd";
import {
    CheckCircleFilled,
    CloseCircleFilled,
    ShoppingCartOutlined,
    FieldTimeOutlined,
    CarOutlined,
    SmileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
    orderStripeReturn,
    orderVnpayReturn,
} from "../../redux/order/order.thunk";
import { formatDateOrder } from "../../helpers/formatDate";
import { formatPrice } from "../../helpers/formatPrice";
import Loading from "../../components/Loading";
import { clearCart } from "../../redux/cart/cart.slice";
import isEmpty from "lodash/isEmpty";

const { Title, Text } = Typography;

const OrderReturn = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(true);
    const queryParams = new URLSearchParams(location.search);
    const { orderReturn, isLoading, error } = useSelector((state) => state.order);

    const orderId = queryParams.get("vnp_TxnRef");
    const code = queryParams.get("vnp_ResponseCode");
    const stripeSessionId = queryParams.get("session_id");
    const orderSessionId = queryParams.get("order_session") || "";

    useEffect(() => {
        if (
            !orderId &&
            !code &&
            !orderReturn._id &&
            !error.message &&
            !stripeSessionId &&
            !orderSessionId
        ) {
            navigate("/");
        }
    }, [orderReturn._id, orderId, code, error, stripeSessionId, orderSessionId]);

    useEffect(() => {
        if (orderId && code) {
            dispatch(orderVnpayReturn({ orderId, code })).then((res) => {
                if (res.payload.success) {
                    dispatch(clearCart());
                    setIsSuccess(true);
                    navigate("/order-return");
                } else {
                    setIsSuccess(false);
                    navigate("/order-return");
                }
            });
        }
    }, []);

    useEffect(() => {
        if (stripeSessionId || orderSessionId) {
            dispatch(orderStripeReturn({ stripeSessionId, orderSessionId })).then(
                (res) => {
                    if (res.payload.success) {
                        dispatch(clearCart());
                        setIsSuccess(true);
                        navigate("/order-return");
                    } else {
                        setIsSuccess(false);
                        navigate("/order-return");
                    }
                }
            );
        }
    }, []);

    const handleHomePage = () => {
        navigate("/");
    };

    const handleContinueShopping = () => {
        navigate("/cart");
    };

    const SuccessContent = () => (
        <>
            {!isEmpty(orderReturn) && (
                <>
                    <div className="text-center mb-8">
                        <Text className="text-gray-500">
                            Đặt ngày {formatDateOrder(orderReturn?.createdAt)}
                        </Text>
                    </div>
                    <Divider />
                    <div className="mb-8">
                        <Title level={4}>Thông tin đơn hàng</Title>
                        <div className="flex justify-between items-center mb-2">
                            <Text>Tổng tiền:</Text>
                            <Text strong>{formatPrice(orderReturn?.totalAmount)} đ</Text>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <Text>Phương thức thanh toán:</Text>
                            <Text>{orderReturn?.paymentMethod}</Text>
                        </div>
                        <div className="flex justify-between items-center">
                            <Text>Địa chỉ giao hàng:</Text>
                            <Text className="text-right">{orderReturn?.address}</Text>
                        </div>
                    </div>
                    <Divider />
                    <div className="mb-8">
                        <Title level={4}>Trạng thái đơn hàng</Title>
                        <Timeline
                            items={[
                                {
                                    color: "green",
                                    children: "Đơn hàng đã đặt thành công",
                                    dot: <ShoppingCartOutlined className="text-xl" />,
                                },
                                {
                                    color: "blue",
                                    children: "Đang xử lý",
                                    dot: <FieldTimeOutlined className="text-xl" />,
                                },
                                {
                                    color: "gray",
                                    children: "Đang giao hàng",
                                    dot: <CarOutlined className="text-xl" />,
                                },
                                {
                                    color: "gray",
                                    children: "Đã giao hàng",
                                    dot: <SmileOutlined className="text-xl" />,
                                },
                            ]}
                        />
                    </div>
                </>
            )}
        </>
    );

    const FailureContent = () => (
        <>
            {error && (
                <>
                    <div className="text-center mb-8">
                        <Title level={3} className="text-red-600">
                            {error?.message}
                        </Title>
                        <Text className="text-gray-500">
                            Vui lòng kiểm tra lại thông tin và thử lại
                        </Text>
                    </div>
                </>
            )}
        </>
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-purple-800 p-6">
                    <Result
                        icon={
                            isSuccess ? (
                                <CheckCircleFilled className="text-white text-7xl" />
                            ) : (
                                <CloseCircleFilled className="text-white text-7xl" />
                            )
                        }
                        title={
                            <span className="text-white text-3xl font-bold">
                                {isSuccess ? "Đặt hàng thành công!" : "Đặt hàng thất bại"}
                            </span>
                        }
                        subTitle={
                            <span className="text-white text-lg">
                                {isSuccess
                                    ? "Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý."
                                    : "Rất tiếc, đã xảy ra lỗi khi xử lý đơn hàng của bạn. Vui lòng thử lại."}
                            </span>
                        }
                    />
                </div>
                <div className="p-8">
                    {isSuccess ? <SuccessContent /> : <FailureContent />}
                    <div className="flex justify-center space-x-4 mt-8">
                        <Button
                            type="primary"
                            size="large"
                            onClick={isSuccess ? handleHomePage : handleContinueShopping}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            {isSuccess ? "Trang chủ" : "Giỏ hàng"}
                        </Button>
                        <Button size="large" onClick={handleContinueShopping}>
                            {isSuccess ? "Tiếp tục mua sắm" : "Quay lại trang chủ"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderReturn;