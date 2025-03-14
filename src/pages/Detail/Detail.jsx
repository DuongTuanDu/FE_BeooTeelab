import {
    Breadcrumb,
    Carousel,
    Empty,
    Image,
    InputNumber,
    message,
    notification,
    Rate,
    Spin,
    Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import DescriptionDetail from "../../components/DescriptionDetail";
import RateList from "../../components/RateList";
import ProductList from "../../components/ProductList";
import ModalRate from "../../components/Modal/ModalRate";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getDetailProduct,
    getProductHome,
} from "../../redux/product/product.thunk";
import empty from "../../resources/empty-order.png";
import { formatPrice } from "../../helpers/formatPrice";
import { size } from "../../const/size";
import { addToCart } from "../../redux/cart/cart.slice";
import {
    BsTruck,
    BsShieldCheck,
    BsArrowRepeat,
    BsStars,
    BsRulers,
    BsHeart,
    BsHeartFill,
    BsBag,
} from "react-icons/bs";
import confetti from "canvas-confetti";

const Detail = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch();
    const { productDetail, isLoading, productHome } = useSelector(
        (state) => state.product
    );
    const [rate, setRate] = useState(0);
    const [hoverValue, setHoverValue] = useState(0);
    const [open, setOpen] = useState(false);
    const { slug } = useParams();
    const [product, setProduct] = useState({
        productId: "",
        name: "",
        image: "",
        size: "S",
        color: "",
        price: "",
        quantity: 1,
    });
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(getDetailProduct(slug));
        }
    }, [slug]);

    useEffect(() => {
        if (productDetail && !isLoading) {
            setProduct((prev) => ({
                ...prev,
                productId: productDetail._id,
                name: productDetail.name,
                image: productDetail.variants?.[0]?.image?.url || "",
                color: productDetail.variants?.[0]?.color || "",
                price: productDetail.isPromotion
                    ? productDetail.promotion.finalPrice
                    : productDetail.price,
            }));
        }
    }, [productDetail, isLoading]);

    useEffect(() => {
        if (productDetail?.category?.slug) {
            dispatch(getProductHome(productDetail?.category?.slug));
        }
    }, [productDetail]);

    const handleChangeProduct = (key, value) => {
        setProduct((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

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
                            {formatPrice(product?.price)}đ
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
                <button
                    onClick={() => navigate("/cart")}
                    className="mt-2 w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
                >
                    <BsBag />
                    Xem giỏ hàng
                </button>
            ),
        });
    };

    const handleAddToCart = () => {
        if (!product.quantity || product.quantity <= 0) {
            message.error("Vui lòng nhập số lượng hợp lệ");
            return;
        }
        dispatch(addToCart(product));
        openNotification();
    };

    const items = [
        {
            key: "1",
            label: (
                <div className="text-sm sm:text-base lg:text-lg">MÔ TẢ SẢN PHẨM</div>
            ),
            children: <DescriptionDetail />,
        },
        {
            key: "2",
            label: (
                <div className="text-sm sm:text-base lg:text-lg">
                    THÔNG TIN ĐÁNH GIÁ
                </div>
            ),
            children: <RateList {...{ slug }} />,
        },
    ];

    const createIcon = (index) => {
        const isActive =
            (rate && rate >= index) || (hoverValue && hoverValue >= index);
        const gradientId = `gradient-${index}`;

        return (
            <svg
                width="35px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                key={index}
            >
                <defs>
                    <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={isActive ? "#ff9a9e" : "#a8edea"} />
                        <stop offset="100%" stopColor={isActive ? "#fad0c4" : "#fed6e3"} />
                    </linearGradient>
                </defs>
                <path
                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                    fill={`url(#${gradientId})`}
                />
            </svg>
        );
    };

    const customIcons = () => {
        return {
            1: createIcon(1),
            2: createIcon(2),
            3: createIcon(3),
            4: createIcon(4),
            5: createIcon(5),
        };
    };

    if (isLoading)
        return (
            <div className="m-10 flex items-center justify-center">
                <Spin />
            </div>
        );

    if (!isLoading && !productDetail?._id)
        return (
            <Empty className="m-10" description="Không tìm thấy thông tin sản phẩm" />
        );

    return (
        <div>
            {contextHolder}
            <ModalRate
                {...{
                    rate,
                    setRate,
                    setHoverValue,
                    hoverValue,
                    open,
                    setOpen,
                    product: {
                        _id: productDetail?._id,
                        name: productDetail?.name,
                        image: productDetail?.mainImage?.url,
                        slug: productDetail?.slug,
                    },
                }}
            />
            <Breadcrumb
                items={[
                    {
                        title: (
                            <div className="text-slate-600 text-sm sm:text-base cursor-pointer" onClick={() => navigate("/")}>
                                <HomeOutlined /> Trang chủ
                            </div>
                        ),
                    },
                    {
                        title: (
                            <div className="text-slate-800 text-sm sm:text-base cursor-pointer">
                                Chi Tiết Sản Phẩm
                            </div>
                        ),
                    },
                ]}
            />
            {productDetail ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-sm">
                        <div className="w-full">
                            <Carousel
                                dots={false}
                                arrows
                                infinite
                                autoplay
                                className="product-carousel rounded-lg overflow-hidden"
                            >
                                <Image
                                    src={productDetail?.mainImage?.url}
                                    key={productDetail?.mainImage?.publicId}
                                    className="aspect-square object-cover"
                                />
                                {productDetail?.variants?.map((variant) => (
                                    <Image
                                        src={variant.image.url}
                                        key={variant._id}
                                        className="aspect-square object-cover"
                                    />
                                ))}
                            </Carousel>
                        </div>

                        <div className="w-full space-y-6">
                            <div className="flex justify-between items-start gap-4">
                                <h1 className="text-xl sm:text-2xl font-bold">
                                    {productDetail.name}
                                </h1>
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="p-2 hover:bg-rose-50 rounded-full transition-colors"
                                >
                                    {isWishlisted ? (
                                        <BsHeartFill className="text-2xl text-rose-600" />
                                    ) : (
                                        <BsHeart className="text-2xl text-gray-400 hover:text-rose-600" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-2xl sm:text-3xl font-bold text-rose-600">
                                    {formatPrice(
                                        productDetail?.isPromotion
                                            ? productDetail?.promotion?.finalPrice
                                            : productDetail?.price
                                    )}
                                    đ
                                </span>
                                {productDetail?.isPromotion && (
                                    <span className="text-gray-400 line-through">
                                        {formatPrice(productDetail?.price)}đ
                                    </span>
                                )}
                                {productDetail?.promotion &&
                                    productDetail?.promotion?.promotionInfo?.type ===
                                    "PERCENTAGE" && (
                                        <span className="bg-rose-100 text-rose-600 px-2 py-1 rounded-full text-sm font-medium">
                                            {productDetail?.promotion?.promotionInfo?.value} %
                                        </span>
                                    )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <BsTruck className="text-xl text-rose-600" />
                                    <span className="text-sm">Miễn phí vận chuyển</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsShieldCheck className="text-xl text-rose-600" />
                                    <span className="text-sm">Bảo hành 12 tháng</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsArrowRepeat className="text-xl text-rose-600" />
                                    <span className="text-sm">Đổi trả trong 30 ngày</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BsStars className="text-xl text-rose-600" />
                                    <span className="text-sm">Chính hãng 100%</span>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-3 flex justify-between items-center">
                                    <span>Màu sắc: {product.color}</span>
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {productDetail?.variants?.map((variant, index) => (
                                        <div
                                            onClick={() => {
                                                handleChangeProduct("color", variant.color);
                                                handleChangeProduct("image", variant.image.url);
                                            }}
                                            key={`color${index}`}
                                            className="cursor-pointer transform hover:scale-105 transition-transform"
                                        >
                                            <img
                                                className={`w-16 h-16 rounded-lg border-2 ${variant.color === product.color
                                                        ? "border-rose-600 shadow-lg"
                                                        : "border-gray-200"
                                                    }`}
                                                src={variant.image.url}
                                                alt={variant.color}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <h2 className="text-lg font-semibold">
                                        Size: {product.size}
                                    </h2>
                                    <button className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1">
                                        <BsRulers className="text-lg" /> Bảng Size
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
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
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-2">Số lượng:</h2>
                                <div className="flex items-center gap-4">
                                    <InputNumber
                                        min={1}
                                        value={product.quantity}
                                        onChange={(value) => handleChangeProduct("quantity", value)}
                                        className="w-32"
                                    />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-center mb-4">
                                    Đánh giá sản phẩm
                                </h3>
                                <div className="flex justify-center">
                                    <Rate
                                        value={rate}
                                        onHoverChange={setHoverValue}
                                        onChange={(value) => {
                                            setRate(value);
                                            setOpen(true);
                                        }}
                                        character={({ index = 0 }) => customIcons()[index + 1]}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 group"
                            >
                                <BsBag className="text-xl group-hover:animate-bounce" />
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Tabs defaultActiveKey="1" items={items} className="custom-tabs" />
                    </div>

                    {productHome.length > 0 &&
                        productHome.map((item, index) => {
                            if (item.products.length > 0) {
                                return (
                                    <React.Fragment key={item.category._id || index}>
                                        <div className="mt-12">
                                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                                <BsStars className="text-rose-600" />
                                                SẢN PHẨM KHÁC
                                            </h2>
                                            <ProductList
                                                products={item?.products}
                                                isPagination={false}
                                            />
                                            <div className="flex justify-center mt-8">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/category/${item.category.slug}`)
                                                    }
                                                    className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                                                >
                                                    <BsStars className="text-xl" />
                                                    Xem thêm sản phẩm
                                                </button>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                );
                            }
                            return null;
                        })}
                </>
            ) : (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <img
                            src={empty}
                            alt="Empty"
                            className="max-w-[300px] mx-auto mb-4"
                        />
                        <h3 className="text-xl font-medium text-gray-600">
                            Không tìm thấy sản phẩm
                        </h3>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Detail;