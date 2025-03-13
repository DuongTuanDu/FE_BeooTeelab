import React, { useEffect, useState } from "react";
import {
    List,
    Pagination,
    Modal,
    InputNumber,
    notification,
    message,
    Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../helpers/formatPrice";
import {
    AiOutlineHeart,
    AiFillHeart,
    AiOutlineEye,
    AiOutlineShopping,
} from "react-icons/ai";
import { MdOutlineLocalShipping, MdOutlineVerified } from "react-icons/md";
import { BsBag, BsStars } from "react-icons/bs";
import { size } from "../const/size";
import confetti from "canvas-confetti";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cart/cart.slice";
import { createAverageRate } from "../helpers/rate";

const ProductList = ({
    products,
    title = "",
    setPagination,
    pagination = {
        page: 1,
        pageSize: 12,
        totalPage: 0,
        totalItems: 0,
    },
    isPagination = true,
    isLoading = false,
}) => {
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [hoveredVariant, setHoveredVariant] = useState({});
    const [wishlist, setWishlist] = useState(new Set());
    const [product, setProduct] = useState({
        productId: "",
        name: "",
        image: "",
        color: "",
        size: "S",
        price: 0,
        quantity: 1,
    });

    useEffect(() => {
        if (quickViewProduct) {
            setProduct((prev) => ({
                ...prev,
                productId: quickViewProduct._id,
                name: quickViewProduct.name,
                image: quickViewProduct.variants?.[0]?.image?.url || "",
                color: quickViewProduct.variants?.[0]?.color || "",
                price: quickViewProduct.price,
            }));
        }
    }, [quickViewProduct]);

    if (isLoading)
        return (
            <div className="flex justify-center items-center mt-10">
                <Spin />
            </div>
        );

    const openNotification = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });

        api.success({
            message: (
                <div className="font-bold text-base sm:text-xl">
                    Thêm vào giỏ hàng thành công!
                </div>
            ),
            description: (
                <div className="flex gap-4">
                    <div className="relative w-24 min-w-[7rem]">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                        <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                            Mới
                        </div>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium mb-2 line-clamp-2">{product.name}</h4>
                        <div className="flex gap-2 text-sm text-gray-600 mb-2">
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                                Size: {product.size}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 rounded-full">
                                Màu: {product.color}
                            </span>
                        </div>
                        <div className="text-rose-600 font-bold">
                            {formatPrice(product.price)}đ
                        </div>
                    </div>
                </div>
            ),
            style: {
                width: "600px",
                borderRadius: 10,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
            placement: "topRight",
            duration: 3,
            btn: (
                <Link to={"/cart"}>
                    <button className="mt-2 w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
                        <BsBag />
                        Xem giỏ hàng
                    </button>
                </Link>
            ),
        });
    };

    const handleAddToCart = () => {
        if (!product.quantity || product.quantity <= 0) {
            message.warning("Vui lòng nhập số lượng hợp lệ");
            return;
        }
        dispatch(addToCart(product));
        openNotification();
    };

    const handleChangeProduct = (key, value) => {
        setProduct((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChangePage = (key, value) => {
        setPagination((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleQuickView = (e, product) => {
        e.stopPropagation();
        setQuickViewProduct(product);
    };

    const toggleWishlist = (e, productId) => {
        e.stopPropagation();
        setWishlist((prev) => {
            const newWishlist = new Set(prev);
            if (newWishlist.has(productId)) {
                newWishlist.delete(productId);
            } else {
                newWishlist.add(productId);
            }
            return newWishlist;
        });
    };

    return (
        <div className="mx-auto py-8">
            {/* Tiêu đề với icon */}
            {contextHolder}
            {title && (
                <div className="relative mb-8 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold uppercase inline-block relative">
                        <BsStars className="inline-block mr-2 text-rose-600" />
                        {title}
                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-800"></div>
                    </h2>
                </div>
            )}

            <List
                loading={isLoading}
                grid={{
                    gutter: 24,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 4,
                    xxl: 5,
                }}
                dataSource={products}
                renderItem={(item) => (
                    <List.Item>
                        <div
                            className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                            onClick={() => navigate(`/detail/${item.slug}`)}
                        >
                            {/* Phần ảnh sản phẩm */}
                            <div className="relative pb-[125%] overflow-hidden">
                                <img
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={hoveredVariant[item._id] || item?.mainImage?.url}
                                    alt={item.name}
                                />

                                {/* Badge giảm giá */}
                                <div className="absolute top-3 left-3">
                                    {item.isPromotion &&
                                        item.promotion &&
                                        item.promotion.promotionInfo.type === "PERCENTAGE" && (
                                            <span className="bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                                                -{item.promotion.promotionInfo.value}%
                                            </span>
                                        )}
                                </div>

                                {/* Các nút thao tác nhanh */}
                                <div className="absolute right-3 top-3 flex flex-col gap-2 transform translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors"
                                        onClick={(e) => toggleWishlist(e, item._id)}
                                    >
                                        {wishlist.has(item._id) ? (
                                            <AiFillHeart className="w-5 h-5 text-rose-600" />
                                        ) : (
                                            <AiOutlineHeart className="w-5 h-5 text-rose-600" />
                                        )}
                                    </button>
                                    <button
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-rose-50 transition-colors"
                                        onClick={(e) => handleQuickView(e, item)}
                                    >
                                        <AiOutlineEye className="w-5 h-5 text-rose-600" />
                                    </button>
                                </div>

                                {/* Màu sắc sản phẩm */}
                                <div className="absolute bottom-3 left-3 flex gap-2">
                                    {item.variants?.map((variant, idx) => (
                                        <img
                                            src={variant.image.url}
                                            key={idx}
                                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
                                            style={{ backgroundColor: variant.color }}
                                            onMouseEnter={() =>
                                                setHoveredVariant({ [item._id]: variant.image.url })
                                            }
                                            onMouseLeave={() =>
                                                setHoveredVariant({ [item._id]: item.mainImage.url })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className="p-4">
                                <h3 className="text-sm font-medium line-clamp-2 mb-2 h-10">
                                    {item.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <div className="flex gap-2 items-center">
                                        {[1, 2, 3, 4, 5].map((_, index) =>
                                            createAverageRate(index + 1, parseFloat(item.averageRating || 0), "14px", "14px")
                                        )}
                                    </div>
                                    <div className="text-slate-400">
                                        ({item.totalReviews} đánh giá)
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-rose-600 font-bold">
                                            {formatPrice(
                                                item.isPromotion
                                                    ? item.promotion.finalPrice
                                                    : item.price
                                            )}
                                            đ
                                        </span>
                                        {item.isPromotion && (
                                            <span className="text-gray-400 line-through">
                                                {formatPrice(item.price)}đ
                                            </span>
                                        )}
                                    </div>
                                    <button className="bg-rose-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-rose-700">
                                        <AiOutlineShopping className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                )}
            />

            {/* Modal xem nhanh */}
            <Modal
                open={!!quickViewProduct}
                onCancel={() => setQuickViewProduct(null)}
                footer={null}
                width={900}
                closeIcon={null}
            >
                {quickViewProduct && (
                    <div className="flex gap-8">
                        <div className="w-1/2">
                            <img
                                src={quickViewProduct.mainImage.url}
                                alt={quickViewProduct.name}
                                className="w-full rounded-lg"
                            />
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {quickViewProduct.variants?.map((variant, idx) => (
                                    <img
                                        key={idx}
                                        src={variant.image.url}
                                        alt={variant.color}
                                        className="w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="w-1/2">
                            <h2 className="text-2xl font-bold mb-4">
                                {quickViewProduct.name}
                            </h2>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-2xl font-bold text-rose-600">
                                    {formatPrice(
                                        quickViewProduct.isPromotion
                                            ? quickViewProduct.promotion.finalPrice
                                            : quickViewProduct.price
                                    )}
                                    đ
                                </span>
                                {quickViewProduct.isPromotion && (
                                    <span className="text-gray-400 line-through">
                                        {formatPrice(quickViewProduct.price)}đ
                                    </span>
                                )}
                                {quickViewProduct.promotion &&
                                    quickViewProduct.promotion.promotionInfo.type ===
                                    "PERCENTAGE" && (
                                        <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-sm font-medium">
                                            {quickViewProduct.promotion.promotionInfo.value} %
                                        </span>
                                    )}
                            </div>

                            {/* Chính sách mua hàng */}
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <MdOutlineLocalShipping className="text-rose-600 text-xl" />
                                    <span>Miễn phí vận chuyển cho đơn hàng từ 500K</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MdOutlineVerified className="text-rose-600 text-xl" />
                                    <span>Cam kết chính hãng 100%</span>
                                </div>
                            </div>

                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: quickViewProduct.description,
                                }}
                            />

                            <div className="py-4">
                                <h3 className="font-medium mb-2">Số lượng</h3>
                                <div className="flex items-center gap-4">
                                    <InputNumber
                                        size="middle"
                                        min={1}
                                        value={product.quantity}
                                        onChange={(value) => handleChangeProduct("quantity", value)}
                                        className="w-32"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {size?.map((itemSize, index) => (
                                    <button
                                        onClick={() => handleChangeProduct("size", itemSize)}
                                        key={index}
                                        className={`w-12 h-12 rounded-lg font-bold border-2 transition-all
                                       ${product.size === itemSize
                                                ? "bg-rose-600 text-white border-rose-600"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-rose-600"
                                            }`}
                                    >
                                        {itemSize}
                                    </button>
                                ))}
                            </div>

                            {/* Chọn màu sắc */}
                            <div className="mt-6">
                                <h3 className="font-medium mb-2">Màu sắc có sẵn</h3>
                                <div className="flex gap-2 items-center flex-wrap">
                                    {quickViewProduct.variants?.map((variant, idx) => (
                                        <img
                                            onClick={() => {
                                                handleChangeProduct("color", variant.color);
                                                handleChangeProduct("image", variant.image.url);
                                            }}
                                            key={idx}
                                            src={variant.image.url}
                                            alt={variant.color}
                                            className={`w-12 h-12 cursor-pointer rounded-full border-2 ${variant.color === product.color
                                                ? "border-rose-600 shadow-lg"
                                                : "border-gray-200"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Nút thêm vào giỏ hàng */}
                            <button
                                onClick={handleAddToCart}
                                className="mt-6 w-full bg-rose-600 text-white py-3 rounded-full hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <AiOutlineShopping className="text-xl" />
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Phân trang */}
            {products?.length > 0 && pagination.totalPage > 1 && isPagination && (
                <div className="mt-8 flex justify-center">
                    <Pagination
                        current={pagination.page}
                        pageSize={pagination.pageSize}
                        total={pagination.totalItems}
                        onChange={(page) => handleChangePage("page", page)}
                        showSizeChanger={false}
                        defaultCurrent={1}
                        className="custom-pagination"
                    />
                </div>
            )}
        </div>
    );
};

export default ProductList;